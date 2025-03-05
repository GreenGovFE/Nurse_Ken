import * as React from 'react';
import { HiOutlineUpload } from 'react-icons/hi';
import { FileUpload } from '../utility/fetches_medical';
import { ClipLoader } from 'react-spinners';
import notification from '../utility/notification';

const UploadButton = (props) => {
  const [files, setFiles] = React.useState([]);
  const [filenames, setFilenames] = React.useState([]);
  const [imagess, setImagess] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const checkResponse = (req) => {
    let fname = req.doclink?.split('_').pop();
    props.setdocumentArray((prev) => (
      prev.concat({
        name: fname,
        path: req?.doclink
      })
    ));
  };

  const onChange = async (e) => {
    const supportedTypes = ['jpeg', 'png', 'gif', 'pdf', 'msword', 'ppt', 'pptx', 'vnd.ms-excel', 'xls', 'xlsx', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'doc', 'txt', 'Text Document', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'tiff', 'tif'];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const { type, size } = file;
      const fileType = type.slice(type.indexOf('/') + 1);

      if (supportedTypes.includes(fileType) && size / 1024 < 500000) {
        const data = new FormData();
        data.append('files', file);

        const defObj = {
          docTitle: file.name,
        };

        setFiles([...files, file]);
        setFilenames((prevValues) => [...prevValues, file.name]);
        setImagess([...imagess, defObj]);

        if (props.formState && props.setFormState && props.stateName) {
          props.setFormState({
            ...props.formState,
            [props.stateName]: 'Uploading...',
          });
        }

        try {
          setLoading(true); // Set loading to true
          const response = await FileUpload(data, checkResponse, props?.patientRef);
          if (response?.code === 1) {
            const updatedImages = imagess.map((image) =>
              image.docTitle === file.name ? { ...image, docPath: response.doclink } : image
            );

            setImagess(updatedImages);

            if (props.sendImagg) {
              props.sendImagg(updatedImages);
            }

            if (props.formState && props.setFormState && props.stateName) {
              props.setFormState({
                ...props.formState,
                [props.stateName]: response.doclink,
                [props?.stateName2]: file.name,
              });
            }

            notification({ message: 'Uploaded Successfully', type: "success" });


          } else {
            // Handle upload error
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          // Handle error
        } finally {
          props?.fetch(); // Toggle the reset state
          setLoading(false); // Set loading to false after completion
        }
      } else {
        // Handle invalid file type or size
      }
    }
  };

  React.useEffect(() => {
    setFilenames([]);
    setFiles([]);
  }, [props.reload]);

  React.useEffect(() => {
    if (props?.fileName) {
      setFilenames([...filenames, props?.fileName]);
    } else {
      setFilenames([]);
    }
  }, [props?.fileName]);

  return (
    <div>
      <>
        {loading ? (
          <ClipLoader color="#3C7E2D" loading={loading} size={40} />
        ) : (
          <div className='flex flex-direction-v col-5'>
            <label className="m-b-10">Attach File</label>

            <input type='file' id='file' multiple hidden onChange={props.onChange || onChange} />
            <label
              className='rounded-btn'
              htmlFor='file'
            >
              <span>{props.btnText || 'Upload Document'}</span>
            </label>
          </div>
        )}
      </>
    </div>
  );
};

export default UploadButton;