import React from "react";

function Response({response = null}) {
	let jsonString = "";
	let jsonLines = [];
	
	if(response !== null){
		jsonString = JSON.stringify(response.data, null, 2);

		jsonLines = jsonString.split('\n');
	}
	else{
		jsonLines = new Array(20).fill(" ");
	}

	return(
		<div className="response">
			<div className="responseDetails">
				<p>Status: {response ? <span style={{color:response.statusCode === 200 ? 'green': 'red'}}>{response.statusCode} {response.statusMessage}</span> : null}</p>
				<p>Time: {response ? <span style={{color:response.responseTime < 1000 ? 'green': 'yellow'}}>{response.responseTime} ms</span> : null}</p>
			</div>
			<div className="responseJson">
				<div className="line-numbers">
					{jsonLines.map((line, index) => {
						return (
							<div key={index} className="line">
								<span className="line-number">{index + 1}</span>
							</div>
						)
					})}
				</div>
				<div className="responseHolder">
					<pre className="code">{jsonString}</pre>
				</div>
			</div>
		</div>
	)
}

export default Response;