import './home.scss'
import React from 'react'
import { useState } from 'react';

export default function Home({ showDocs, documents, updateDocuments }) {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [fileNames, setFileNames] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('')
    let randomString = Math.random().toString(36);

    const [fileInputKey, setfileInputKey] = useState(randomString)
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const showErrorMessage = (msg)=>{
        setErrorMessage(msg);
        setTimeout(()=>{
            setErrorMessage('');
        },3000)
    }

    const showSuccessMessage = (msg)=>{
        setSuccessMessage(msg);
        setTimeout(()=>{
            setSuccessMessage('');
        },3000)
    }

    const handleOnChange = (e) => {
        const files = e.target.files
        let selectedFileNames = ""
        try {
            for (const file of files) {
                if (selectedFileNames === "") {
                    selectedFileNames = file.name
                } else {
                    selectedFileNames = selectedFileNames.concat(',', file.name)
                }
            }
            setSelectedFiles(e.target.files)
            setFileNames(selectedFileNames)
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    const handleUpload = async function (event) {
        try {
            if (selectedFiles) {
                let formData = new FormData();
                for (let file of selectedFiles) {
                    formData.append('files', file)
                }

                const requestOptions = {
                    method: 'POST',
                    body: formData,
                    redirect: 'follow'
                };

                await setSelectedFiles(null)
                await setFileNames(null)
                await setfileInputKey(null)


                const response = await fetch("http://localhost:5000/document/upload", requestOptions)
                let jsonRes = await response.json();
                setfileInputKey(randomString)
                if (response.status === 400) {
                    showErrorMessage(jsonRes.error)
                    return
                } else {
                    
                    updateDocuments()
                    showSuccessMessage(jsonRes.message)
                }
            }
        } catch (error) {
            console.log('error :>> ', error);

        }
    }

    const deleteDocument = async function (id) {
        try {
            const res = fetch('http://localhost:5000/document/delete/' + id, {
                method: 'DELETE',
            })
            if ((await res).status === 200) {
                updateDocuments()
            }
        } catch (error) {
        }

    }

    return (
        <div className="home">
            <div className="topbar">
                <h1>Document Managemnt System</h1>
            </div>
            <div className="msgDiv">
                {errorMessage && (
                    <span className="error"> <i class="fas fa-times"></i> {errorMessage} </span>
                    
                )}
                {successMessage && (
                    <span className="success"> <i class="fas fa-check"></i> {successMessage} </span>
                    
                )}
                
            </div>
            <div className="btnwrapper">
                <div className="form">
                    {/* <div className="displayFNames">
                        <input type="text" value={fileNames}/>
                    </div> */}
                    <input
                        id="documents"
                        key={fileInputKey || ''}
                        accept=".doc,.docx,.pdf"
                        multiple
                        type="file"
                        onChange={(e) => handleOnChange(e)}
                    />
                    {/* <label id="lblDocuments" for="documents">
                        Choose Files
                    </label> */}
                    <div className="btn-upload" onClick={event => handleUpload(event)}>Upload</div>
                </div>
            </div>
            <div className={"tablewrapper "+(showDocs && "active")}>
                <table id="doument-table">
                    <thead>
                        <tr>
                        <th className="tableHeader">File Name</th>
                        <th className="tableHeader">Type</th>
                        <th className="tableHeader">Expires On</th>
                        <th className="tableHeader">Delete</th>
                    </tr>
                    </thead>
                    {
                        documents.map(el => {
                            return (
                                <tbody key={el.id}>
                                <tr  className="data-row">
                                    {/* <td>
                                        {el.id}
                                    </td> */}
                                    <td className="tableData">
                                        {el.fileName.trim()}
                                    </td>
                                    <td className="tableData">
                                        {el.type.trim()}
                                    </td>
                                    <td className="tableData">
                                        {formatDate(el.expiresOn)}
                                    </td>
                                    <td className="tableData">
                                        <a href="#" onClick={() => deleteDocument(el.id)}>Delete</a>
                                    </td>
                                </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}
