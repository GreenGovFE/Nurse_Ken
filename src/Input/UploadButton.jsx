/* eslint-disable no-console */
/* eslint-disable quotes */
import * as React from 'react';
import { HiOutlineUpload } from 'react-icons/hi';
import { FileUpload } from '../utility/fetches';


const UploadButton = (props) => {
  const [files, setFiles] = React.useState([]);
  const [filenames, setFilenames] = React.useState([]);
  const [imagess, setImagess] = React.useState([]);
  console.log(files, filenames, imagess);

  const checkResponse= (req) =>{
    console.log(req)
    let fname = req.doclink?.split('_').pop()
    console.log(fname)
   props.setdocumentArray((prev)=>(
     prev.concat({
      name: fname,
      path: req?.doclink
     })
   ))
    
  }

  props.setDocNames(filenames)

  const onChange = async (e) => {
    const supportedTypes = ['jpeg', 'png', 'gif', 'pdf', 'msword', 'ppt', 'pptx', 'vnd.ms-excel', 'xls', 'xlsx', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'doc','txt','Text Document', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  
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
        // setFilenames([...filenames, file.name]);
        setFilenames(prevValues => [...prevValues, file.name]);

        setImagess([...imagess, defObj]);
  
        if (props.formState && props.setFormState && props.stateName) {
          props.setFormState({
            ...props.formState,
            [props.stateName]: 'Uploading...', // Set a placeholder or loading state
          });
        }
  
        try {
          const response = await FileUpload(data,checkResponse);
          console.log('file upload response', response);
  
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
          } else {
            // Handle upload error
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          // Handle error
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
    <div >
      <input type='file' id='file' multiple hidden onChange={props.onChange || onChange} />
      <label
       //style={{border:'2px solid red', height: '20px'}}
       className='rounded-btn'
        //className='flex space-between'
        htmlFor='file'

       >
        
        <span>{props.btnText || 'Upload Document'}</span>
      </label>
      
    </div>
  );
};

export default UploadButton;
