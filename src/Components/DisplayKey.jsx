import React, {useEffect, useState} from "react";
import { BiWorld } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import DeleteAlert from "./DeleteAlert.jsx";
import EditKeyForm from "./EditKeyForm.jsx";
import {IoLanguage} from "react-icons/io5";

export default function DisplayKey({ keys, setKeys, userId, deleteKey }) {
    const [isClient, setIsClient] = useState(false);
    const [copiedKeyId, setCopiedKeyId] = useState(null);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentKey, setCurrentKey] = useState(null);
    const [error, setError] = useState(null);
    const [keyId, setKeyId] = useState(null);


    useEffect(() => {
        setIsClient(true);
    }, []);

    let counter = 1;

    // Kopírovanie kľúča
    const handleCopy = (key, keyId) => {
        // Vždy skonvertuj kľúč na JSON reťazec, aj keď je už objekt
        const jsonKey = typeof key === "string" ? key : JSON.stringify(key);
        navigator.clipboard.writeText(jsonKey)
            .then(() => {
                setCopiedKeyId(keyId);
                setTimeout(() => setCopiedKeyId(null), 2000);
            })
            .catch(err => console.error("Error copying text: ", err));
    };

    // Sťahovanie kľúča
    const handleDownload = (doc) => {
        if (typeof window === "undefined") return;

        const jsonData = {
            key: doc.key,
            name: doc.name || "Neznámy dokument",
            description: doc.description || "Bez popisu",
            country: doc.country || "Neznáma krajina",
            language: doc.language || "Neznámy jazyk",
            author: doc.author || "Neznámy autor",
            year: doc.year !== -1 ? doc.year : "Neznámy rok"
        };

        const jsonString = JSON.stringify(jsonData, null, 2);
        const element = document.createElement("a");
        const file = new Blob([jsonString], { type: "application/json" });
        element.href = URL.createObjectURL(file);
        element.download = `kluc.json`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Uprava kľúča
    const handleEditSubmit = async (formData, id) => {
        if (!id) {
            setError("Zadajte ID kľúča.");
        }

        try {

            // fetch('localhost:3000/api/keys/${id}',
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/keys/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
                return;
            }

            const updatedKey = await response.json();

            setKeys(prevKeys =>
                prevKeys.map(key =>
                    key._id === id
                        ? { ...key, ...updatedKey.key }
                        : key
                )
            );

            setError(null);
            setIsEditing(false);
            setError(null);

        } catch (error) {
            console.error("Chyba:", error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError(null);
    };

    // Vymazanie kľúča
    const handleDelete = async (keyId) => {

        if (!keyId) {
            setError("Zadajte ID kľúča.");
        }

        try {
            // fetch(`http://localhost:3000/api/keys/${keyId}`,

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/keys/${keyId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });

            if (!response.ok) throw new Error("Chyba pri odstraňovaní súboru");

            deleteKey(keyId);

            setShowDeleteAlert(false);
            setKeyId(null);
            setError(null);
        } catch (error) {
            console.error("Chyba:", error);
        }
    };

    const handleDeleteClick = (id) => {
        setKeyId(id);
        setShowDeleteAlert(true);
    };

    const dismissDelete = () => {
        setKeyId(null);
        setShowDeleteAlert(false);
    };

    const handleEditClick = (key) => {
        setCurrentKey(key);
        setIsEditing(true);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-xl mx-auto mb-6">
            <ul className='flex flex-col justify-center items-center w-full gap-5'>
                {keys.map((keyData, index) => (
                    <React.Fragment key={keyData._id}>
                        <div
                            className="sm:w-full w-5/6 max-w-3xl rounded-3xl px-6 py-5 bg-custom-dark-blue shadow-lg transform transition-all duration-500 ease-in-out opacity-0 animate-fadeIn"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="flex gap-3 mb-3">
                                <svg width="44" height="42" viewBox="0 0 44 42" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M43.5572 33.1727C43.5059 32.9939 43.4179 32.8265 43.2983 32.6804C43.1787 32.5343 43.0299 32.4123 42.8605 32.3216C42.6941 32.2312 42.5106 32.1734 42.3205 32.1515C42.1305 32.1296 41.9378 32.1441 41.7538 32.1942L39.6379 32.7499L39.2492 31.4032L41.3614 30.8432C41.7363 30.745 42.055 30.5088 42.2475 30.1865C42.4401 29.8641 42.4906 29.482 42.3881 29.1241L42.0038 27.7613C41.8958 27.4048 41.6446 27.1035 41.3049 26.923C40.9652 26.7425 40.5645 26.6973 40.1901 26.7974L38.0633 27.3574L35.5983 18.7968C37.0891 17.8015 38.2207 16.3903 38.8379 14.7569C39.455 13.1234 39.5275 11.3477 39.0453 9.67343C38.4493 7.57698 37.0176 5.78625 35.0564 4.68407C36.4008 3.61912 37.6293 2.42759 38.7234 1.12753C38.782 1.05432 38.8249 0.970804 38.8497 0.881757C38.8745 0.792711 38.8806 0.699876 38.8678 0.608554C38.855 0.517232 38.8235 0.429211 38.775 0.349516C38.7266 0.269822 38.6622 0.200015 38.5855 0.144081C38.5088 0.088147 38.4213 0.0471815 38.328 0.0235235C38.2347 -0.000134475 38.1374 -0.00602174 38.0417 0.00619787C37.946 0.0184175 37.8538 0.0485047 37.7703 0.0947416C37.6868 0.140978 37.6137 0.20246 37.5551 0.275675C36.3753 1.65766 35.0404 2.91203 33.5742 4.0163C31.86 3.41395 29.9909 3.3405 28.2306 3.80631C27.2996 4.05272 26.4174 4.44336 25.619 4.96265C24.2219 4.34852 22.679 4.09937 21.148 4.24068C19.617 4.38198 18.1527 4.90866 16.9048 5.76691C15.7181 4.70106 14.2422 3.97392 12.6445 3.66796C11.0468 3.362 9.39128 3.48946 7.86564 4.0359C6.28306 2.90812 4.81717 1.63843 3.48798 0.244176C3.35909 0.109599 3.18027 0.0283317 2.98956 0.0176647C2.79886 0.00699765 2.61131 0.0677727 2.46684 0.18706C2.32236 0.306347 2.23235 0.47473 2.21596 0.656386C2.19957 0.838041 2.2581 1.01863 2.37909 1.15973C3.6016 2.45611 4.9405 3.64802 6.3805 4.72186C5.1373 5.43544 4.09849 6.43162 3.35676 7.62154C2.61502 8.81145 2.19344 10.1581 2.1296 11.5413C2.06577 12.9246 2.36167 14.3014 2.99092 15.5489C3.62017 16.7965 4.56319 17.876 5.73585 18.6911L0.126087 36.583C0.0141412 36.9347 -0.0238072 37.3041 0.0144255 37.6699C0.0526582 38.0358 0.166317 38.3907 0.34886 38.7145C0.531403 39.0382 0.779226 39.3243 1.07806 39.5562C1.3769 39.7882 1.72086 39.9614 2.09013 40.066C2.45928 40.1724 2.84679 40.2082 3.23047 40.1715C3.61416 40.1348 3.9865 40.0263 4.3262 39.8521C4.66589 39.6779 4.96628 39.4416 5.21018 39.1565C5.45407 38.8714 5.63669 38.5433 5.74758 38.1908L7.85977 38.7956C8.23216 38.8949 8.63043 38.852 8.97029 38.676C9.31016 38.5 9.56496 38.2048 9.68079 37.8527L10.0981 36.5116C10.1548 36.334 10.1737 36.1473 10.1535 35.9626C10.1334 35.778 10.0746 35.599 9.98075 35.4364C9.89045 35.2759 9.76734 35.1343 9.6187 35.0199C9.47005 34.9056 9.29889 34.8209 9.11534 34.7707L7.00903 34.1681L7.43073 32.8262L9.53412 33.4226C9.71729 33.4769 9.90998 33.4958 10.1009 33.4782C10.2918 33.4605 10.4771 33.4066 10.6459 33.3197C10.8169 33.2332 10.9682 33.1152 11.0909 32.9724C11.2137 32.8297 11.3055 32.6651 11.361 32.4881L11.79 31.1379C11.8947 30.7816 11.8491 30.4003 11.6629 30.0756C11.4768 29.7509 11.165 29.5086 10.7941 29.4006L8.68704 28.7972L11.3581 20.2905C13.0361 20.2127 14.6551 19.6754 16.0218 18.7429C16.8991 19.5276 17.9361 20.1318 19.0683 20.518V39.2001C19.0683 39.9427 19.3774 40.6549 19.9275 41.1799C20.4777 41.705 21.2238 42 22.0019 42C22.7799 42 23.5261 41.705 24.0762 41.1799C24.6264 40.6549 24.9355 39.9427 24.9355 39.2001H27.1357C27.5247 39.2001 27.8978 39.0526 28.1728 38.7901C28.4479 38.5276 28.6025 38.1715 28.6025 37.8002V36.4003C28.6025 36.029 28.4479 35.6729 28.1728 35.4104C27.8978 35.1478 27.5247 35.0003 27.1357 35.0003H24.9355V33.6004H27.1357C27.5247 33.6004 27.8978 33.4529 28.1728 33.1904C28.4479 32.9278 28.6025 32.5718 28.6025 32.2005V30.8005C28.6025 30.4292 28.4479 30.0732 28.1728 29.8106C27.8978 29.5481 27.5247 29.4006 27.1357 29.4006H24.9355V20.5173C25.6415 20.2763 26.3116 19.9486 26.9288 19.5423C27.8793 19.9586 28.9007 20.208 29.9438 20.2786L35.1473 38.2902C35.3543 39.0067 35.851 39.6153 36.5281 39.9823C37.2053 40.3493 38.0075 40.4445 38.7582 40.2469C39.5089 40.0494 40.1466 39.5754 40.5311 38.929C40.9156 38.2827 41.0154 37.5171 40.8084 36.8006L42.9199 36.2449L42.936 36.2407C43.3056 36.1352 43.6181 35.8971 43.8076 35.5764C43.9972 35.2557 44.0491 34.8773 43.9525 34.5209L43.5572 33.1727ZM13.0273 5.20134C14.0453 5.49372 14.9838 5.99547 15.7768 6.67127C15.3492 7.0823 14.9668 7.53404 14.6356 8.01941C14.1723 7.32291 13.466 6.80503 12.6415 6.55718L12.6313 6.55158C11.5065 6.16916 10.4308 5.66617 9.42484 5.05225C10.6198 4.81349 11.8585 4.86475 13.0273 5.20134ZM10.9276 11.9014C10.5437 11.7924 10.1984 11.5854 9.92868 11.3028C9.659 11.0202 9.47525 10.6727 9.39724 10.2978C9.31924 9.92291 9.34993 9.53479 9.486 9.1753C9.62208 8.81581 9.85839 8.49858 10.1694 8.25782C10.4805 8.01706 10.8545 7.8619 11.2512 7.80906C11.6478 7.75622 12.052 7.80772 12.4203 7.95799C12.7885 8.10826 13.1068 8.3516 13.3408 8.6618C13.5748 8.97199 13.7157 9.33726 13.7482 9.71823C13.5754 10.1648 13.4432 10.6248 13.3529 11.093C13.0871 11.4518 12.7105 11.7226 12.2758 11.8675C11.841 12.0125 11.3697 12.0243 10.9276 11.9014ZM10.8234 18.9011C10.663 18.8956 10.5053 18.9418 10.3758 19.0324C10.2463 19.1229 10.1526 19.2525 10.1098 19.4002L7.07137 29.066C7.04359 29.1541 7.03427 29.2465 7.04394 29.338C7.05361 29.4295 7.08207 29.5183 7.1277 29.5993C7.17333 29.6803 7.23524 29.7519 7.30989 29.81C7.38454 29.8682 7.47046 29.9117 7.56274 29.9382L10.379 30.7438L9.95509 32.0829L7.14617 31.2849C6.96003 31.232 6.75951 31.2518 6.58862 31.3399C6.41772 31.4279 6.29039 31.5771 6.23456 31.7546L5.39188 34.4355C5.33602 34.6132 5.3564 34.8049 5.44854 34.9683C5.54068 35.1317 5.69705 35.2535 5.88326 35.3069L8.69144 36.1098L8.27047 37.4502L5.46156 36.6453C5.36886 36.6186 5.27156 36.6098 5.17527 36.6192C5.07898 36.6287 4.9856 36.6562 4.90051 36.7003C4.81542 36.7443 4.74031 36.804 4.67952 36.8759C4.61872 36.9478 4.57344 37.0305 4.54628 37.1191L4.34312 37.7848C4.28782 37.9616 4.19643 38.1263 4.07421 38.2693C3.95198 38.4123 3.80133 38.5309 3.63093 38.6181C3.46053 38.7053 3.27374 38.7596 3.0813 38.7776C2.88887 38.7957 2.69458 38.7773 2.50963 38.7235C2.32511 38.6715 2.15322 38.5852 2.00388 38.4695C1.85455 38.3538 1.73074 38.2109 1.63962 38.0492C1.5485 37.8875 1.49188 37.7102 1.47303 37.5275C1.45418 37.3448 1.47348 37.1603 1.52981 36.9847L7.29432 18.5966C7.34008 18.4504 7.33454 18.294 7.27853 18.151C7.22253 18.0081 7.11914 17.8866 6.98409 17.8049C5.90628 17.1493 5.02671 16.2363 4.43254 15.1562C3.83837 14.0762 3.55024 12.8668 3.59671 11.6477C3.64318 10.4287 4.02263 9.24241 4.69746 8.20646C5.37228 7.1705 6.31906 6.32085 7.44393 5.74172C7.51727 5.70322 7.59721 5.67172 7.67348 5.63742C8.34319 6.07812 9.03779 6.48331 9.75413 6.85116C9.049 7.22978 8.4952 7.82074 8.17932 8.53164C7.86345 9.24254 7.8033 10.0333 8.00829 10.7803C8.21328 11.5273 8.67185 12.1884 9.3123 12.6602C9.95274 13.1321 10.739 13.388 11.548 13.3882C12.1295 13.3863 12.7024 13.2537 13.2202 13.0011C13.3088 14.7066 13.9408 16.3457 15.0317 17.6993C13.7947 18.5113 12.3215 18.9318 10.8205 18.9011H10.8234ZM24.0026 19.3344C23.849 19.3758 23.7138 19.4639 23.6175 19.5853C23.5211 19.7067 23.4689 19.8547 23.4687 20.007V30.1006C23.4687 30.2862 23.5459 30.4642 23.6835 30.5955C23.821 30.7268 24.0076 30.8005 24.2021 30.8005H27.1357V32.2005H24.2021C24.0076 32.2005 23.821 32.2742 23.6835 32.4055C23.5459 32.5367 23.4687 32.7148 23.4687 32.9004V35.7003C23.4687 35.8859 23.5459 36.064 23.6835 36.1953C23.821 36.3265 24.0076 36.4003 24.2021 36.4003H27.1357V37.8002H24.2021C24.0076 37.8002 23.821 37.8739 23.6835 38.0052C23.5459 38.1365 23.4687 38.3145 23.4687 38.5002V39.2001C23.4687 39.5714 23.3141 39.9275 23.0391 40.19C22.764 40.4526 22.3909 40.6001 22.0019 40.6001C21.6129 40.6001 21.2398 40.4526 20.9647 40.19C20.6896 39.9275 20.5351 39.5714 20.5351 39.2001V20.007C20.5351 19.8547 20.483 19.7066 20.3868 19.585C20.2906 19.4635 20.1554 19.3753 20.0019 19.3337C19.0562 19.0841 18.1727 18.6558 17.4037 18.0743C16.6347 17.4927 15.996 16.7696 15.5252 15.948C15.0545 15.1264 14.7615 14.2229 14.6635 13.2912C14.5655 12.3595 14.6645 11.4184 14.9547 10.5239C15.2449 9.62938 15.7203 8.79958 16.3529 8.08372C16.9854 7.36786 17.7621 6.78051 18.6369 6.35652C19.5117 5.93252 20.4668 5.6805 21.4456 5.61541C22.4244 5.55033 23.4069 5.67349 24.3348 5.9776C23.937 6.35984 23.5786 6.77779 23.2648 7.22565C22.8612 7.0797 22.4335 7.00384 22.0019 7.00166C21.0293 7.00166 20.0966 7.37039 19.4089 8.02673C18.7212 8.68308 18.3349 9.57328 18.3349 10.5015C18.3349 11.4297 18.7212 12.3199 19.4089 12.9762C20.0966 13.6326 21.0293 14.0013 22.0019 14.0013C22.0195 14.0013 22.0364 14.0013 22.054 14.0013C22.0657 14.0468 22.0723 14.0923 22.0855 14.1371C22.6237 16.0036 23.8228 17.6344 25.4789 18.752C25.0095 18.997 24.5135 19.1923 23.9997 19.3344H24.0026ZM21.8024 12.5818C21.2394 12.5335 20.7177 12.2798 20.3459 11.8735C19.9741 11.4671 19.7809 10.9395 19.8066 10.4006C19.8324 9.86169 20.075 9.35303 20.4839 8.98063C20.8929 8.60823 21.4366 8.40081 22.0019 8.40159C22.1822 8.40353 22.3616 8.42705 22.5358 8.47159C21.9279 9.75955 21.6742 11.1742 21.7987 12.5818H21.8024ZM42.518 34.8988L39.7076 35.638C39.6142 35.6623 39.5268 35.704 39.4503 35.7606C39.3739 35.8173 39.31 35.8878 39.2623 35.9682C39.2146 36.0486 39.184 36.1371 39.1723 36.2288C39.1606 36.3205 39.1681 36.4135 39.1942 36.5025L39.3922 37.1702C39.4947 37.5293 39.4436 37.9124 39.2503 38.2355C39.0569 38.5587 38.7371 38.7953 38.3611 38.8935C38.1766 38.9443 37.9834 38.9592 37.7928 38.9375C37.6022 38.9157 37.4181 38.8577 37.2514 38.7669C37.0828 38.6765 36.9348 38.5549 36.816 38.4092C36.6972 38.2636 36.6101 38.0967 36.5598 37.9185L31.2148 19.4121C31.1717 19.2651 31.0794 19.1357 30.952 19.0435C30.8246 18.9512 30.6692 18.9012 30.5093 18.9011C28.7402 18.8867 27.0363 18.2625 25.7115 17.1435C24.3866 16.0245 23.5303 14.4861 23.3002 12.812C23.0701 11.1379 23.4818 9.4408 24.4595 8.03357C25.4371 6.62633 26.9147 5.6038 28.6201 5.15444C29.258 4.98706 29.9166 4.90207 30.5782 4.90176C31.0715 4.90635 31.563 4.95912 32.045 5.05925C31.0837 5.66318 30.0494 6.15414 28.9648 6.52148C28.9589 6.52148 28.9545 6.52848 28.9486 6.53058C28.2568 6.72574 27.6407 7.11162 27.1778 7.63976C26.7149 8.16791 26.4258 8.81479 26.3467 9.49922C26.2677 10.1836 26.4022 10.8751 26.7334 11.4868C27.0647 12.0985 27.5779 12.6032 28.2086 12.9375C28.8393 13.2718 29.5594 13.4209 30.2786 13.366C30.9977 13.3111 31.6839 13.0546 32.2508 12.6289C32.8178 12.2031 33.2404 11.6269 33.4655 10.9728C33.6907 10.3186 33.7083 9.61548 33.5162 8.95176C33.3879 8.50757 33.169 8.09194 32.872 7.7287C32.5749 7.36546 32.2057 7.06178 31.7854 6.83506C32.4761 6.4719 33.1431 6.0689 33.7825 5.62832C33.9174 5.69132 34.0553 5.74452 34.1866 5.81591C35.0262 6.26688 35.7634 6.87282 36.3551 7.59843C36.9469 8.32404 37.3815 9.1548 37.6335 10.0423C38.0576 11.5103 37.9689 13.0701 37.3807 14.4857C36.7926 15.9012 35.7372 17.0952 34.3743 17.8868C34.2379 17.9658 34.1321 18.085 34.0731 18.2265C34.014 18.368 34.005 18.524 34.0472 18.6708L36.8488 28.4003C36.8743 28.489 36.9178 28.572 36.9769 28.6446C37.0359 28.7172 37.1094 28.778 37.1931 28.8235C37.2768 28.869 37.3691 28.8983 37.4647 28.9098C37.5602 28.9213 37.6572 28.9146 37.7501 28.8903L40.5877 28.1407L40.9749 29.4958L38.152 30.2406C38.0591 30.2649 37.972 30.3064 37.8959 30.3628C37.8197 30.4193 37.756 30.4895 37.7083 30.5695C37.6606 30.6494 37.63 30.7376 37.618 30.8289C37.606 30.9202 37.6131 31.0128 37.6387 31.1015L38.4161 33.7957C38.4415 33.8844 38.485 33.9674 38.5441 34.04C38.6032 34.1126 38.6767 34.1734 38.7604 34.2189C38.8441 34.2644 38.9364 34.2937 39.0319 34.3052C39.1275 34.3166 39.2245 34.31 39.3174 34.2857L42.1417 33.5479L42.5348 34.8778C42.5338 34.8823 42.5317 34.8865 42.5288 34.8901C42.5259 34.8937 42.5222 34.8967 42.518 34.8988ZM29.396 7.85702C29.587 7.80624 29.7844 7.78057 29.9827 7.78072C30.5417 7.78034 31.08 7.98265 31.4887 8.34672C31.8973 8.71079 32.1458 9.20942 32.1838 9.74172C32.2218 10.274 32.0465 10.8002 31.6934 11.2138C31.3403 11.6275 30.8358 11.8976 30.2819 11.9697C29.728 12.0417 29.1661 11.9102 28.71 11.6018C28.2538 11.2934 27.9374 10.8311 27.8249 10.3085C27.7123 9.78595 27.8119 9.24205 28.1036 8.78691C28.3953 8.33177 28.8573 7.99939 29.396 7.85702Z"
                                        fill="white"/>
                                </svg>

                                <h2 className="text-fontSize24 font-bold text-white">{keyData.name ? keyData.name : "Šifrovací kľúč č. " + counter++}</h2>
                            </div>
                                <div className="mb-2 text-fontSize12 text-white/70 italic">
                                    {keyData.author ? <span>Autor: {keyData.author}</span> : "Autor: Neznámy"}
                                    <span className="mx-1">|</span>
                                    {keyData.source ? <span>Zdroj: {keyData.source}</span> : "Zdroj neznámy"}
                                </div>
                            <p className="text-fontSize12 font-light text-white truncate max-w-full"
                               title={keyData.description || "Bez popisu"}>
                                {keyData.description ? keyData.description : "Bez popisu"}
                            </p>
                            <div className="sm:flex grid justify-between">
                                <div
                                    className="mt-4 flex text-fontSize16 font-semibold text-white mb-2 sm:justify-around gap-3 flex-wrap">
                                    <div
                                        className="flex items-center max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={keyData.country || "-"}>
                                        <BiWorld/>
                                        <span className="ml-1 truncate">{keyData.country ? keyData.country : "-"}</span>
                                    </div>
                                    <div
                                        className="flex items-center max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={keyData.language || "-"}>
                                        <IoLanguage/>
                                        <span className="ml-1 truncate">{keyData.language ? keyData.language : "-"}</span>
                                    </div>
                                    <div
                                        className="flex items-center max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={keyData.year !== -1 && keyData.year !== undefined ? keyData.year.toString() : "-"}>
                                        <FaRegCalendarAlt/>
                                        <span
                                            className="ml-1 truncate">{keyData.year !== -1 && keyData.year !== undefined ? keyData.year : "-"}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex text-fontSize16 font-semibold text-white mb-2 gap-1">
                                    {keyData.uploadedBy === userId && userId !== null ? (
                                        <>
                                            <div className="relative flex items-center">
                                                <button
                                                    onClick={() => handleDeleteClick(keyData._id)}
                                                    type="button"
                                                    className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                                                            fill="#FEF7FF"/>
                                                    </svg>
                                                    <span
                                                        className="absolute right-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Vymaž kľúč
                                            </span>

                                        </button>
                                    </div>

                                    <div className="relative flex items-center">
                                        <button
                                            onClick={() => handleEditClick(keyData)}
                                            type="button"
                                            className="p-1 px-3 bg-custom-dark-blue hover:bg-custom-dark-blue-hover text-white rounded-3xl sm:text-fontSize16 text-fontSize12 relative group">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
                                                    fill="#FEF7FF"/>
                                            </svg>
                                            <span
                                                className="absolute right-2/3 top-10 ml-2 whitespace-nowrap bg-custom-dark-blue text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Uprav kľúč
                                            </span>

                                        </button>
                                    </div>
                                    </>
                                    ) : null}


                                    <div className="relative flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(keyData)}
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
                                                    Stiahni .json súbor
                                            </span>

                                        </button>
                                    </div>

                                    <div className="relative flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(keyData.key, keyData._id)}
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
                                                    Kopírovať kľúč
                                            </span>
                                        </button>
                                        {copiedKeyId === keyData._id && (
                                            <div
                                                className="absolute bg-custom-dark-blue-hover top-0 right-0 text-white text-sm px-2 py-1 rounded-3xl shadow-lg mt-[-35px] mr-2">
                                                Skopírované!
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <li className='mb-2 p-4 rounded-lg shadow-sm bg-custom-dark-blue-hover max-h-40 overflow-y-auto'>
                                {Object.entries(typeof keyData.key === "string" ? JSON.parse(keyData.key) : keyData.key)
                                    .map(([keyName, values]) => (
                                        <div key={keyName} className="my-2">
                                            <span className="text-white font-bold">{keyName.toUpperCase()}:</span>
                                            <span className="text-white ml-2">
                {Array.isArray(values) ? values.join(", ") : Object.values(values).join(", ")}
            </span>
                                        </div>
                                    ))}
                            </li>
                        </div>
                    </React.Fragment>
                ))}
                {showDeleteAlert && (
                    <DeleteAlert onConfirm={() => handleDelete(keyId)} onDismiss={dismissDelete} docType={"kľúč"}></DeleteAlert>
                )}

                {isEditing && (

                    <EditKeyForm
                        currentKey={currentKey}
                        onSave={handleEditSubmit}
                        onCancel={handleCancel}
                        error={error}
                        setError={setError}
                    />
                )}
            </ul>
        </div>
    );
}
