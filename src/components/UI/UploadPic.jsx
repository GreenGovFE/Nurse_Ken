/* eslint-disable no-console */
/* eslint-disable quotes */
import * as React from 'react';
import { HiOutlineUpload } from 'react-icons/hi';
import { FileUpload } from '../../utility/fetches';
// import { feedback } from '../modal/feedback';

// var baseURL='http://edogoverp.com'
const UploadPic = (props) => {
  const [file, setFile] = React.useState('');
  const [filename, setFilename] = React.useState('');
  const [imagg, setImagg] = React.useState('');
  const [namm, setNamm] = React.useState('');
  const [imagess, setImagess] = React.useState([]);
  
  props.name(namm)
  
  const onChangePIc = (e) => {
    props?.setLoading(true)     
    // setFile(e.target.files[0]);
    // setFilename(e.target.files[0].name);
    const data = new FormData();

    const supportedTypes = ['jpeg', 'png', 'gif', 'pdf', 'msword', 'ppt', 'pptx', 'vnd.ms-excel', 'xls', 'xlsx', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'doc', 'txt', 'Text Document', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'tiff', 'tif'];

    const { type, size } = e.target.files[0] ?? '';

    let doc = e.target.files[0];

    const fileType = type.slice(type.indexOf('/') + 1);


    let defObj = {
      docTitle: '',
      docPath: ''
    };

    // if (!supportedTypes.includes(fileType)){
    //   notification({
    //     title: "Upload Error",
    //     message: "Unsopported file type",
    //     type: "danger"
    //   })
    // }



    if (supportedTypes.includes(fileType) && size / 1024 < 500000) {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
      data.append('files', doc);
      FileUpload(data, (response) => {  
        if (response.code === 1) {
          setImagg(response.doclink);
          props.handlePicChange(response.doclink)
          setNamm(doc.name);
          defObj.docTitle = doc.name;
          defObj.docPath = response.doclink;
          setImagess([...imagess, defObj]);
          props.sendImagg && props.sendImagg(defObj);
          if (props.formState && props.setFormState && props.stateName) {
            props.setFormState({
              ...props.formState,
              [props.stateName]: response.doclink,
              [props?.stateName2]: e.target.files[0].name,
            });
          }

        } else if (response.code === 0) {
          setFile('');
          setFilename('Choose File');
          // feedback({
          //   title: "Upload Error",
          //   text: response?.message,
          //   type: "danger"
          // })

        } else {
          setFile('');
          setFilename('Choose File');
          // notification({
          //   title: "Upload Error",
          //   message: response?.message,
          //   type: "danger"
          // })

        }
      });
    }
    props?.setLoading(false)
  };

  React.useEffect(() => {
    setFilename('');
    setFile('');
  }, [props.reload]);

  React.useEffect(() => {
    if (props?.fileName) {
      setFilename(props?.fileName);
    } else {
      setFilename('');
    }
  }, [props?.fileName]);

  return (
    <div className={`${props?.className}`}>
      <input type='file' id='file' hidden onChange={props.onChange || onChangePIc} />
      <label
        //className='flex space-between'
        htmlFor='file'

       >
        
        <span className='cardUpload'>
            <p className='m-b-20 m-t-20'>{props.btnText || 'Upload Photo'}</p>
        </span>      
      </label>


    </div>
  );
};

export default UploadPic;
