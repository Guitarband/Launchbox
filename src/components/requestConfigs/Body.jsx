import React from 'react';
import '../../styles/requestConfig.css';

function Body({currentBody, setCurrentBody, setRestApis, selectedCollection, selectedApi}) {
  return (
	<div className="requestParameters">
		<div className="parametersList">
			<div className='paramHolder'>
				<input type="text" placeholder="Key" value="Key" disabled />
				<input type="text" placeholder="Value" value="Value" disabled />
				<button>Remove</button>
			</div>
		{
			currentBody.map((entry, index) => {
				return (
					<div className="paramHolder" key={index}>
						<input type="text" placeholder="Key" value={entry.key} onChange={
							(e) => {
								const newKey = e.target.value;
								setCurrentHeaders((prev) => {
									const entries = [...prev];
									entries.splice(index, 1, { 'key' : newKey, 'value' : entry.value });
									setRestApis((prev) => {
										const newApis = [...prev.apis];
										newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
										newApis[selectedCollection].endpoints[selectedApi].body = entries;
										return {apis: newApis};
									})
									return entries;
								})
							}
						} />
						<input type="text" placeholder="Value" value={entry.value} onChange={
							(e) => {
								setCurrentHeaders((prev) => {
									const entries = [...prev];
									entries.splice(index, 1, { 'key' : entry.key, 'value' : e.target.value });
									setRestApis((prev) => {
										const newApis = [...prev.apis];
										newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
										newApis[selectedCollection].endpoints[selectedApi].body = entries;
										return {apis: newApis};
									})
									return entries;
								})
							}
						} />
						<button onClick={() => {
							setCurrentHeaders((prev) => {
								const entries = [...prev];
								entries.splice(index, 1);
								setRestApis((prev) => {
									const newApis = [...prev.apis];
									newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
									newApis[selectedCollection].endpoints[selectedApi].body = entries;
									return {apis: newApis};
								})
								return entries;
							})
						}}>Remove</button>
					</div>
				)
			})
		}
		</div>
		<button id='addParam' onClick={() => {
		setCurrentHeaders((prev) => {
			const newEntries = [...prev];
			newEntries.push({ 'key' : '', 'value' : '' });
			setRestApis((prev) => {
				const newApis = [...prev.apis];
				newApis[selectedCollection].endpoints[selectedApi].unsaved = true;
				newApis[selectedCollection].endpoints[selectedApi].body = newEntries;
				return {apis: newApis};
			})
			return newEntries;
		})
		}}>+ Add New</button>
	</div>
  );
}

export default Body;