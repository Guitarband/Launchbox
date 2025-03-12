import React, {useState, useEffect} from "react";
import apis from "../data/restApis.json";
import Parameters from "./requestConfigs/Parameters.jsx";
import Body from "./requestConfigs/Body.jsx";
import Headers from "./requestConfigs/Headers.jsx";
import Response from "./response.jsx";

function RestPage() {
   const [restApis, setRestApis] = useState(apis);
   const [selectedCollection, setSelectedCollection] = useState(restApis.lastCollection);
   const [selectedApi, setSelectedApi] = useState(restApis.lastRoute);
   const [response, setResponse] = useState(null);
   const [currentParams, setCurrentParams] = useState(restApis.apis[selectedCollection].endpoints[selectedApi].params);
   const [currentBody, setCurrentBody] = useState(restApis.apis[selectedCollection].endpoints[selectedApi].body);
   const [currentHeaders, setCurrentHeaders] = useState(restApis.apis[selectedCollection].endpoints[selectedApi].headers);
   const [selectedConfig, setSelectedConfig] = useState("params");

   useEffect(() => {
      window.indexBridge.onApiResponse((res) => {
         setResponse(res);
      })
   }, [])

   const sendRequest = async () => {
      const req = {
         method: document.getElementById("restSelect").value,
         url: document.getElementById("restURL").value,
      }

      if(currentHeaders.length > 0) {
         let headers = {}
         currentHeaders.forEach(entry => {
            headers[entry.key] = entry.value;
         })
         req['headers'] = headers;
      }

      if(currentBody.length > 0) {
         let body = {}
         currentBody.forEach(entry => {
            body[entry.key] = entry.value;
         })
         req['body'] = JSON.stringify(body);
      }
      
      if(currentParams.length > 0) {
         req.url += "?"
         currentParams.forEach(entry => {
            req.url += `&${entry.key}=${entry.value}`;
         });
      }

      console.log(req);

      try {
         const data = window.indexBridge.sendRequest(req)
         setResponse(data);
      } catch (error) {
         setResponse(error.response)
      }
   }

   const createNew = (type) => {
      setRestApis((prev) => {
         const newApis = [...prev.apis];
         
         if(type === "collection") {
            const details = {
               name: "New Collection",
               state: "closed",
               endpoints: []
            }
            if(newApis.some(collection => collection.name === "New Collection")) {
               let i = 1;
               while(newApis.some(collection => collection.name === `New Collection ${i}`)) {
                  i++;
               }
               details.name = `New Collection ${i}`;
            }
            newApis.splice(selectedCollection + 1, 0, details);
         } else if(type === "route") {
            const details = {
               name: "New Route",
               method: "GET",
               url: "",
               params: [],
               body: [],
               headers: [],
            }
            if(newApis[selectedCollection].endpoints.some(api => api.name === "New Route")) {
               let i = 1;
               while(newApis[selectedCollection].endpoints.some(api => api.name === `New Route ${i}`)) {
                  i++;
               }
               details.name = `New Route ${i}`;
            }
            newApis[selectedCollection].endpoints.splice(selectedApi + 1, 0, details);
         }
         
         return {lastCollection: selectedCollection, lastRoute: selectedApi, apis: newApis};
      });
   }

   const openCloseCollection = (index) => {
      setRestApis((prev) => {
         const newApis = [...prev.apis];
         const collection = newApis[index];
         collection.state = collection.state === "closed" ? "open" : "closed";
         return {lastCollection: selectedCollection, lastRoute: selectedApi, apis: newApis };
      });
      
      setSelectedCollection(index);
   }

   const saveRequest = () => {
      setRestApis((prev) => {
         const newApis = [...prev.apis];
         newApis[selectedCollection].endpoints[selectedApi].url = document.getElementById("restURL").value;
         newApis[selectedCollection].endpoints[selectedApi].method = document.getElementById("restSelect").value;
         newApis[selectedCollection].endpoints[selectedApi].params = currentParams;
         newApis[selectedCollection].endpoints[selectedApi].body = currentBody;
         window.indexBridge.saveFile({lastCollection: selectedCollection, lastRoute: selectedApi, apis: newApis});
         return {lastCollection: selectedCollection, lastRoute: selectedApi, apis: newApis};
      })
   }

   const getColour = (method) => {
      switch(method) {
         case "GET":
            return "green";
         case "POST":
            return "yellow";
         case "PURGE":
            return "purple";
         default:
            return "white";
      }
   }

   return(
      <>
         <div className="restPage">
            <div className="apiCollection">
               <input type="text" placeholder="Search" />
               <div className="restCreator">
                  <button className="createRest" onClick={() => createNew('collection')}>New Collection</button>
                  <button className="createRest" onClick={() => createNew('route')}>New Route</button>
               </div>
               {
                  restApis.apis.map((collection, index) => {
                     return (
                        <div key={collection.name}>
                           <div className="collectionHeader" onClick={() => openCloseCollection(index) }>
                              <p>{collection.name}</p>
                           </div>
                           <div className="apiCollection">
                              {
                                 collection.state === "closed" ? null :
                                 collection.endpoints.map((api) => {
                                    return (
                                       <div className="apiNameDir" key={api.name} onClick={() => {
                                          setSelectedCollection(restApis.apis.indexOf(collection));
                                          setSelectedApi(collection.endpoints.indexOf(api));
                                          setCurrentParams(api.params);
                                          setCurrentBody(api.body);
                                          setCurrentHeaders(api.headers);
                                          setResponse(null);
                                       }}>
                                          <p><span style={{color: getColour(api.method), fontWeight: "bold", marginRight: '5px', marginLeft: '15px'}}>{api.method}</span>{api.name}</p>
                                       </div>
                                    )
                                 })
                              }
                           </div>
                        </div>
                     )
                  })
               }
            </div>
            <div className="apiDescription">
               <div className="requestInfo">
                  <h2><span style={{
                     color: getColour(restApis.apis[selectedCollection].endpoints[selectedApi].method),
                     marginRight: '10px'
                     }}>{restApis.apis[selectedCollection].endpoints[selectedApi].method}</span>{restApis.apis[selectedCollection].endpoints[selectedApi].name}</h2>
                  <div className="requestEditor">
                     <select value={restApis.apis[selectedCollection].endpoints[selectedApi].method} onChange={(e) => {
                        setRestApis((prev) => {
                           const newApis = [...prev.apis];
                           newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
                           newApis[selectedCollection].endpoints[selectedApi].method = e.target.value;
                           return {lastCollection: selectedCollection, lastRoute: selectedApi, apis: newApis};
                        })
                     }} id="restSelect" style={{
                        width: "10%",
                        color: getColour(restApis.apis[selectedCollection].endpoints[selectedApi].method),
                        fontWeight: "bold"
                         }}>
                        <option value={"GET"} style={{color: "green", fontWeight: "bold"}}>GET</option>
                        <option value={"POST"} style={{color: "yellow", fontWeight: "bold"}}>POST</option>
                        <option value={"PURGE"} style={{color: "purple", fontWeight: "bold"}}>PURGE</option>
                     </select>
                     <input id="restURL" type="text" value={restApis.apis[selectedCollection].endpoints[selectedApi].url} onChange={
                        (e) => {
                           setRestApis((prev) => {
                              const newApis = [...prev.apis];
                              newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
                              newApis[selectedCollection].endpoints[selectedApi].url = e.target.value;
                              return {lastCollection: selectedCollection, lastRoute: selectedApi, apis: newApis};
                           })
                        }
                     } />
                     <button onClick={sendRequest}>Send</button>
                     <button onClick={saveRequest}>Save</button>
                  </div>
               </div>
               <div className="requestConfig">
                  <nav id="configOptions" onChange={(e) => {
                     setSelectedConfig(e.target.value)
                  }}>
                     <input type="radio" id="params" name="x" value="params" defaultChecked/>
                     <label htmlFor="params">Parameters</label>
                     
                     <input type="radio" id="body" name="x" value="body"/>
                     <label htmlFor="body">Body</label>
                     
                     <input type="radio" id="header" name="x" value="headers"/>
                     <label htmlFor="header">Headers</label>
                  </nav>
                  { selectedConfig === "params" ?
                   <Parameters currentParams={currentParams} setCurrentParams={setCurrentParams} restApis={restApis} setRestApis={setRestApis} selectedCollection={selectedCollection} selectedApi={selectedApi} />
                  : selectedConfig === "body" ? 
                  <Body currentBody={currentBody} setCurrentBody={setCurrentBody} restApis={restApis} setRestApis={setRestApis} selectedCollection={selectedCollection} selectedApi={selectedApi} />
                  : selectedConfig === "headers" ?
                  <Headers currentHeaders={currentHeaders} setCurrentHeaders={setCurrentHeaders} restApis={restApis} setRestApis={setRestApis} selectedCollection={selectedCollection} selectedApi={selectedApi} />
                  : null
                  }
               </div>
               <div className="responseDisplay">
                  <Response response={response} />
               </div>
            </div>
         </div>
      </>
   )
}

export default RestPage;