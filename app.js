document.addEventListener('DOMContentLoaded', function () {
    const generateForm = document.querySelector(".generate-form");
    const imageGallery = document.querySelector(".image-gallery");

    // Note: It's not secure to expose your API key in client-side code.
    // Consider handling the API request on the server side.
    const OPENAI_API_KEY = "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";

    const updateImageCard = (imgDataArray) => {
        imgDataArray.forEach((imgObject, index) => {
            const imgCards = imageGallery.querySelectorAll(".img-card");
            const imgElement = imgCards[index].querySelector("img");

            const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
            imgElement.src = aiGeneratedImg;

            imgElement.onload = () => {
                imgCards[index].classList.remove("loading");
            };
        });
    };

    const generateAiImages = async (userPrompt, userImgQuantity) => {
        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    n: parseInt(userImgQuantity),
                    size: "512x512",
                    response_format: "b64_json"
                })
            });

            if (!response.ok) throw new Error("Failed to generate images! Please try again.");

            const { data } = await response.json();
            updateImageCard([...data]);

        } catch (error) {
            alert(error.message);
        }
    };

    const handleFormSubmission = (e) => {
        e.preventDefault();

        const userPrompt = e.target[0].value;
        const userImgQuantity = e.target[1].value;

        const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
            `<div class="img-card loading">
                <img src="Images/loader.svg" alt="">
            </div>`
        ).join("");

        imageGallery.innerHTML = imgCardMarkup;
        generateAiImages(userPrompt, userImgQuantity);
    };

    generateForm.addEventListener("submit", handleFormSubmission);
});
