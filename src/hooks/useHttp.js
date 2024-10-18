import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);

  const resData = await response.json();
  console.log("response", response);
  // response中有ok屬性，response.ok為true代表串接成功，這裡是如果response.ok為false，!false=true
  if (!response.ok) {
    console.log("resData.message", resData.message);
    throw new Error(
      // 如果resData.message不為空值或false則顯示resData.message，如果為空值或false則顯示"Something went wrong..
      // 直接拋出錯誤到catch

      resData.message || "Something went wrong, failed to send request."
    );
  }

  return resData;
}

// 每次呼叫 useHttp，都會建立一個新的狀態管理範疇。因此，每個使用 useHttp 的元件會擁有各自獨立的狀態。

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  console.log("http被呼叫了!!!!!!!!!");
  // 清理目前的data
  function clearData() {
    setData(initialData);
  }

  // console傳入的東西
  console.log("url", url);
  console.log("config", config);
  console.log("initialData", initialData);

  // 當url或config改變就重新建立funcction

  const sendRequest = useCallback(
    async function sendRequest(data) {
      console.log("data", data);
      console.log("configdata", { ...config, body: data });
      console.log("http useCallback被呼叫了!!!!!!!!!");
      // 開始loading
      setIsLoading(true);

      // 獲得後端資料
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        console.log("resData", resData);
        // 將獲得的資料存在data中
        setData(resData);
      } catch (error) {
        console.log("catchError", error);
        setError(error.message || "Something went wrong!");
      }
      // loading結束
      setIsLoading(false);
    },
    [url, config]
  );

  // 會先初始執行，如果config不是null且他是get或是他的config.method為空，或是config是null
  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      console.log("useEffect");
      console.log("useEffectData", data);
      sendRequest();
      console.log("http  useEffect被呼叫了!!!!!!!!!");
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}
