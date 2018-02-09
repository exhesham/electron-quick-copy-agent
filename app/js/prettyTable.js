function PrettyTable(config){
	function createRow(data){
		return {
			tagName: 'span',
			classNames: ['list-group-item'],
			text: data,
			children:[]
		}
	}
	var container = {
		tagName: 'div',
		classNames: ['list-group'],
		children:[
			{tagName: 'a', classNames: ['list-group-item', 'disabled'], children:[], text: 'I am a title'},
		]
	}

	var row = {
		tagName: 'div',
		classNames: [],
		children:[]
	}

	// {tagName: '', classNames: [], children:[]},
	var dom = {
		tagName: 'span',
		classNames: ['list-group-item'],
		text: '',
		children:[]
	}

	name.appendChild(nameText);
	intro.appendChild(introText);
	container.appendChild(intro);
	container.appendChild(name);

	document.body.appendChild(container);
}