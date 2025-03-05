import axios from "axios";
import { useState, useCallback } from "react";
import Select from "react-select";
import notification from "../../utility/notification";

const EDMSFiles = ({ selectedFile, setSelectedFile }) => {
    const [files, setFiles] = useState([]);

    const handleChange = (value) => {
        console.log(value);
        setSelectedFile(value?.all);
    };

    const getFiles = useCallback((query) => {
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            notification({ message: "User ID not found", type: "error" });
            return;
        }

        try {
            const response = axios.get(
                `${process.env.REACT_APP_BASE_URL}/edmsdepartmentapi/api/file/paginated/user/${userId}?PageNumber=1&PageSize=100&filter=${query}`
            ).then((response) => {
                const items = response?.data?.data?.items || [];
                const formattedFiles = items.map((item) => ({
                    label: item?.fileName?.split("_")[1] || item?.fileName || "Unnamed File",
                    value: item?.fileID,
                    all: item,
                }));

                setFiles(formattedFiles);

            })

        } catch (error) {
            notification({ message: "Failed to fetch M-Files", type: "error" });
            console.error("Error fetching files:", error);
        }
    }, []);

    return (
        <div className="m-t-10">
            <label>Shared-Files</label>
            <Select
                onInputChange={(value) => getFiles(value)}
                onChange={handleChange}
                options={files}
            />
        </div>
    );
};

export default EDMSFiles;
