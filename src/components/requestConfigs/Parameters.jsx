import React from 'react';
import '../../styles/requestConfig.css';

function Parameters({currentParams, setCurrentParams, setRestApis, selectedCollection, selectedApi}) {
  return (
	<div className="requestParameters">
		<div className="parametersList">
			<div className='paramHolder'>
				<input type="text" placeholder="Key" value="Key" disabled />
				<input type="text" placeholder="Value" value="Value" disabled />
				<button>Remove</button>
			</div>
		{
			currentParams.map((entry, index) => {
				return (
					<div className="paramHolder" key={index}>
						<input type="text" placeholder="Key" value={entry.key} onChange={
							(e) => {
								const newKey = e.target.value;
								setCurrentParams((prev) => {
									const params = [...prev];
									params.splice(index, 1, { 'key' : newKey, 'value' : entry.value });
									setRestApis((prev) => {
										const newApis = [...prev.apis];
										newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
										newApis[selectedCollection].endpoints[selectedApi].params = params;
										return {apis: newApis};
									})
									return params;
								})
							}
						} />
						<input type="text" placeholder="Value" value={entry.value} onChange={
							(e) => {
								setCurrentParams((prev) => {
									const params = [...prev];
									params.splice(index, 1, { 'key' : entry.key, 'value' : e.target.value });
									setRestApis((prev) => {
										const newApis = [...prev.apis];
										newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
										newApis[selectedCollection].endpoints[selectedApi].params = params;
										return {apis: newApis};
									})
									return params;
								})
							}
						} />
						<button onClick={() => {
							setCurrentParams((prev) => {
								const params = [...prev];
								params.splice(index, 1);
								setRestApis((prev) => {
									const newApis = [...prev.apis];
									newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
									newApis[selectedCollection].endpoints[selectedApi].params = params;
									return {apis: newApis};
								})
								return params;
							})
						}}>Remove</button>
					</div>
				)
			})
		}
		</div>
		<button id='addParam' onClick={() => {
		setCurrentParams((prev) => {
			const newParams = [...prev];
			newParams.push({key: '', value: ''});
			setRestApis((prev) => {
				const newApis = [...prev.apis];
				newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
				newApis[selectedCollection].endpoints[selectedApi].params = newParams;
				return {apis: newApis};
			})
			return newParams;
		})
		}}>+ Add New</button>
	</div>
  );
}

export default Parameters;