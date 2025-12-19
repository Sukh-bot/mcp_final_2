import { GoogleGenAI } from "@google/genai";

const ai= new GoogleGenAI({
    apiKey:process.env.GEMINI_GENAI_API_KEY ||"AIzaSyCqeBno-d6rORhhtLIfOmGX3BtEUh6cJ04"
});

export async function checkBestPractices(params){
    const {code, language, framework, strictMode=false} = params;
    try {
    const prompt = `You are a code review expert. Analyze this ${language} code for best practices.
${framework ? `Framework: ${framework}` : ""}
Code:
\`\`\`${language}
${code}
\`\`\`


Provide analysis with:
 **What's Good**
List positive things


 **Issues Found**
- Point out problems with line numbers
- Explain why each is an issue


 **Recommendations**
- How to fix each issue
- Better practices to follow


 **Score: X/10**
Give a score and brief reason


Keep it clear and helpful!`;

const response=await ai.models.generateContent({
    model:"gemini-2.5-flash",
    contents:prompt,
});

const analysis=response.text;

return {
    content:[
        {
        type:"text", 
        text:`Best Practices Analysis:\n\n ${analysis} \n\n\n*Powered by Google Gemini 2.5-flash*`
    }
    ]
};
    }
    catch (error) {
        console.error("Error in checkBestPractices and Gemini API error:", error);
    }

    return {
        content:[
            {
            type:"text",    
            text:`Error analyzing code for best practices: ${error.message || "Unknown error occurred" } 
            \n\n Wait a minute between requests or check your API key.`
    }
]
    };

}