exports.handler = async (event) => {
  try {
    const { prompt, size } = JSON.parse(event.body || "{}");
    if (!process.env.OPENAI_API_KEY) return { statusCode:200, body: JSON.stringify({ url:"" }) };
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method:"POST", headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
      body: JSON.stringify({ model:"gpt-image-1", prompt: prompt + ", professional digital marketing creative, high quality", size: size||"1024x1024" })
    });
    const d = await r.json();
    const url = d?.data?.[0]?.url || (d?.data?.[0]?.b64_json ? `data:image/png;base64,${d.data[0].b64_json}` : "");
    return { statusCode:200, headers:{"Content-Type":"application/json"}, body: JSON.stringify({ url }) };
  } catch(e){ return { statusCode:500, body: JSON.stringify({error:e.message}) } }
};
