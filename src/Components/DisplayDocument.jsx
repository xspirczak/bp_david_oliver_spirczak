import React, {useEffect, useState} from "react";
import {FaRegCalendarAlt} from "react-icons/fa";
import {BiWorld} from "react-icons/bi";
import { IoLanguage } from "react-icons/io5";


export default function DisplayDocument({docs}) {
    const [isClient, setIsClient] = useState(false);
    const [copiedDocId, setCopiedDocId] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    let counter = 1;

    const handleCopy = (text, docId) => {
        navigator.clipboard.writeText(text)
            .then(() =>  {
                setCopiedDocId(docId);
                setTimeout(() => setCopiedDocId(null), 2000);
            })
            .catch(err => console.error("Error copying text: ", err));
    };


    const handleDownload = (name, text) => {
        if (!isClient) return;
        const element = document.createElement("a");
        const file = new Blob([text], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `${name || "document"}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };



    return (
        <div className="flex flex-col justify-center items-center w-full max-w-xl mx-auto mb-6">
            <ul className='flex flex-col justify-center items-center w-full gap-5'>
                {docs.map((doc) => (
                    <React.Fragment key={doc._id}>
                        <div className="sm:w-full w-5/6 max-w-3xl rounded-3xl px-6 py-5 bg-custom-dark-blue shadow-lg">
                            <div className="flex gap-3 mb-3">
                                <svg width="41" height="44" viewBox="0 0 41 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.1979 31.5334H10.5715C10.1224 31.5334 9.7583 31.8618 9.7583 32.2668C9.7583 32.6718 10.1224 33.0001 10.5715 33.0001H12.1979C12.647 33.0001 13.0111 32.6718 13.0111 32.2668C13.0111 31.8618 12.647 31.5334 12.1979 31.5334Z" fill="white"/>
                                    <path d="M34.9678 31.5334H15.4509C15.0018 31.5334 14.6377 31.8618 14.6377 32.2668C14.6377 32.6718 15.0018 33.0001 15.4509 33.0001H34.9678C35.4169 33.0001 35.781 32.6718 35.781 32.2668C35.781 31.8618 35.4169 31.5334 34.9678 31.5334Z" fill="white"/>
                                    <path d="M12.1979 27.1335H10.5715C10.1224 27.1335 9.7583 27.4619 9.7583 27.8669C9.7583 28.2719 10.1224 28.6002 10.5715 28.6002H12.1979C12.647 28.6002 13.0111 28.2719 13.0111 27.8669C13.0111 27.4619 12.647 27.1335 12.1979 27.1335Z" fill="white"/>
                                    <path d="M34.9678 27.1335H15.4509C15.0018 27.1335 14.6377 27.4619 14.6377 27.8669C14.6377 28.2719 15.0018 28.6002 15.4509 28.6002H34.9678C35.4169 28.6002 35.781 28.2719 35.781 27.8669C35.781 27.4619 35.4169 27.1335 34.9678 27.1335Z" fill="white"/>
                                    <path d="M12.1979 22.7334H10.5715C10.1224 22.7334 9.7583 23.0617 9.7583 23.4667C9.7583 23.8717 10.1224 24.2001 10.5715 24.2001H12.1979C12.647 24.2001 13.0111 23.8717 13.0111 23.4667C13.0111 23.0617 12.647 22.7334 12.1979 22.7334Z" fill="white"/>
                                    <path d="M34.9678 22.7334H15.4509C15.0018 22.7334 14.6377 23.0617 14.6377 23.4667C14.6377 23.8717 15.0018 24.2001 15.4509 24.2001H34.9678C35.4169 24.2001 35.781 23.8717 35.781 23.4667C35.781 23.0617 35.4169 22.7334 34.9678 22.7334Z" fill="white"/>
                                    <path d="M12.1979 18.3333H10.5715C10.1224 18.3333 9.7583 18.6616 9.7583 19.0666C9.7583 19.4716 10.1224 19.7999 10.5715 19.7999H12.1979C12.647 19.7999 13.0111 19.4716 13.0111 19.0666C13.0111 18.6616 12.647 18.3333 12.1979 18.3333Z" fill="white"/>
                                    <path d="M34.9678 18.3333H15.4509C15.0018 18.3333 14.6377 18.6616 14.6377 19.0666C14.6377 19.4716 15.0018 19.7999 15.4509 19.7999H34.9678C35.4169 19.7999 35.781 19.4716 35.781 19.0666C35.781 18.6616 35.4169 18.3333 34.9678 18.3333Z" fill="white"/>
                                    <path d="M12.1979 13.9333H10.5715C10.1224 13.9333 9.7583 14.2617 9.7583 14.6667C9.7583 15.0717 10.1224 15.4 10.5715 15.4H12.1979C12.647 15.4 13.0111 15.0717 13.0111 14.6667C13.0111 14.2617 12.647 13.9333 12.1979 13.9333Z" fill="white"/>
                                    <path d="M34.9678 13.9333H15.4509C15.0018 13.9333 14.6377 14.2617 14.6377 14.6667C14.6377 15.0717 15.0018 15.4 15.4509 15.4H34.9678C35.4169 15.4 35.781 15.0717 35.781 14.6667C35.781 14.2617 35.4169 13.9333 34.9678 13.9333Z" fill="white"/>
                                    <path d="M40.6497 10.9538C40.6456 10.8895 40.6317 10.8261 40.6082 10.7653C40.5992 10.7419 40.5927 10.7191 40.5814 10.6964C40.5418 10.6167 40.4867 10.5439 40.4187 10.4815L29.0338 0.214867C28.9647 0.153542 28.884 0.103858 28.7956 0.0682C28.7704 0.0579333 28.7452 0.0520667 28.7199 0.044C28.6519 0.0229167 28.5811 0.0100833 28.5093 0.00586667C28.4955 0.00806667 28.4801 0 28.4622 0H5.69243C5.24334 0 4.87923 0.32835 4.87923 0.733333V2.93333H0.813205C0.364112 2.93333 0 3.26168 0 3.66667V43.2667C0 43.6717 0.364112 44 0.813205 44H34.9678C35.4169 44 35.781 43.6717 35.781 43.2667V39.6H39.847C40.2961 39.6 40.6602 39.2717 40.6602 38.8667V11C40.6602 10.9839 40.6513 10.9699 40.6497 10.9538ZM29.2754 2.5036L37.884 10.2667H29.2754V2.5036ZM34.1546 42.5333H1.62641V4.4H4.87923V38.8667C4.87923 39.2717 5.24334 39.6 5.69243 39.6H34.1546V42.5333ZM39.0338 38.1333H6.50564V1.46667H27.649V11C27.649 11.405 28.0131 11.7333 28.4622 11.7333H39.0338V38.1333Z" fill="white"/>
                                    <path d="M15.4507 6.59985H10.5715C10.1224 6.59985 9.7583 6.9282 9.7583 7.33319V11.7332C9.7583 12.1382 10.1224 12.4665 10.5715 12.4665H15.4507C15.8998 12.4665 16.2639 12.1382 16.2639 11.7332V7.33319C16.2639 6.9282 15.8998 6.59985 15.4507 6.59985ZM14.6375 10.9999H11.3847V8.06652H14.6375V10.9999Z" fill="white"/>
                                </svg>


                                <h2 className="text-fontSize24 font-bold text-white">{doc.name ? doc.name : "Šifrovaný dokument č. " + counter++}</h2>
                            </div>
                            <p className="text-fontSize12 font-light text-white">{doc.description ? doc.description : "Bez popisu"}</p>


                            <div className="flex justify-between">
                                <div
                                    className="mt-4 flex text-fontSize16 font-semibold text-white mb-2 gap-5">
                                    <div className="flex items-center">
                                        <BiWorld/>
                                        <span className="ml-1">{doc.country ? doc.country : "-"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <IoLanguage/>
                                        <span className="ml-1">{doc.language ? doc.language : "-"}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaRegCalendarAlt/>
                                        <span className="ml-1">{doc.year !== -1 ? doc.year : "-"}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex text-fontSize16 font-semibold text-white mb-2">

                                    <div className="relative flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(doc.name, doc.document)}
                                            disabled={!isClient}
                                            className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z"
                                                    fill="#FEF7FF"/>
                                            </svg>
                                            <span
                                                className="absolute right-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Stiahni .txt súbor
                                                </span>
                                        </button>
                                    </div>

                                    <div className="relative flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(doc.document, doc._id)}
                                            className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_118_80)">
                                                    <path
                                                        d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5M11 9H20C21.1046 9 22 9.89543 22 11V20C22 21.1046 21.1046 22 20 22H11C9.89543 22 9 21.1046 9 20V11C9 9.89543 9.89543 9 11 9Z"
                                                        stroke="#D9D9D9" strokeWidth="4" strokeLinecap="round"
                                                        strokeLinejoin="round"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_118_80">
                                                        <rect width="24" height="24" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span
                                                className="absolute right-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Kopírovať text
                                                </span>
                                        </button>
                                        {copiedDocId === doc._id && (
                                            <div className="absolute bg-custom-dark-blue-hover top-0 right-0 text-white text-sm px-2 py-1 rounded-3xl shadow-lg mt-[-35px] mr-2">
                                                Skopírované!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <li className='mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover'>
                                <p className="break-all">{doc.document}</p>
                            </li>
                        </div>
                    </React.Fragment>
                ))}
            </ul>
        </div>
    )
}