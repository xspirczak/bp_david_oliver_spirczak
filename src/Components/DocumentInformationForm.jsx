export default function DocumentInformationForm() {

    return (
        <div className="grid justify-center gap-6">
            <div className="flex gap-6">
                <div>
                    <label htmlFor="name"
                           className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Názov</label>
                    <input type="text" name="name" id="name" value={name} onChange={handleInputChange(setName)}
                           className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                           placeholder="Názov dokumentu" required=""/>
                </div>
                <div>
                    <label htmlFor="description"
                           className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Popis</label>
                    <input type="text" name="description" id="description" value={description} onChange={handleInputChange(setDescription)}
                           className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                           placeholder="Popis dokumentu" required=""/>
                </div>
            </div>
            <div className="flex gap-6">

                <div>
                    <label htmlFor="language"
                           className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Jazyk</label>
                    <input type="text" name="language" id="language" value={language} onChange={handleInputChange(setLanguage)}
                           className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                           placeholder="Jazyk dokumentu" required=""/>
                </div>
                <div>
                    <label htmlFor="country"
                           className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Krajina
                        pôvodu</label>
                    <input type="text" name="country" id="country" value={country} onChange={handleInputChange(setCountry)}
                           className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                           placeholder="Krajina pôvodu" required=""/>
                </div>
            </div>
            <div className="flex gap-6">
                <div>
                    <label htmlFor="year"
                           className="mb-2 text-fontSize16 text-custom-dark-blue flex justify-center">Rok</label>
                    <input type="number" name="year" id="year" min="1400" max="2000" value={year} onChange={handleInputChange(setYear)}
                           className="border border-custom-dark-blue text-custom-dark-blue rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                           placeholder="1458" required=""/>
                </div>
            </div>

        </div>
    )
}