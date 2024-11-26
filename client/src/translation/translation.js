import axios from "axios";

let index = 0; 

async function translatePage() {
    const keyValueMap = {};
    index = 0;
    const texts = getTextWithIndices(document, keyValueMap);
    const target = "es";

    try {
        console.log("Prepared Key-Value Map:", keyValueMap);

        const response = await axios.post("/api/translation/translate", {
            texts: Object.entries(keyValueMap).map(([key, value]) => ({ index: key, text: value })),
            target,
        });

        const translations = response.data.translations;
        console.log("Received Translations:", translations);

        texts.forEach(({ index, node }) => {
            const translation = translations[index];
            if (translation) {
                node.nodeValue = translation;
            }
        });
    } catch (error) {
        console.error("Error translating text:", error);
    }
}

/**
 * @param {HTMLElement} element - The root element to start text extraction.
 */
function getTextWithIndices(element, keyValueMap = {}, texts = []) {
    element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== '') {
            const parentTagName = node.parentNode.tagName?.toLowerCase();
            if (parentTagName !== "style" && parentTagName !== "script") {
                keyValueMap[index] = node.nodeValue;
                texts.push({ index: index, node: node });
                index++;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            getTextWithIndices(node, keyValueMap, texts);
        }
    });
    return texts;
}

export { translatePage };
