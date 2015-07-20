var inFilter = [];
countFilters = 0;


function filterJson(curData, query){

	genomeInterval = query.split(':');
	specificGenomes = query.split(',');
	if (genomeInterval.length == 2){
		filterByInterval(curData, genomeInterval);
		addFilter(query);
	}
	else if (specificGenomes.length > 0){
		filterByGenome(curData, specificGenomes);
		addFilter(query);
	}

}

function filterByInterval(curData, genomeInterval){

	currentData.Genomes = curData.Genomes.slice(parseInt(genomeInterval[0])-1, parseInt(genomeInterval[1]));

	d3.selectAll('svg').remove();
	setScale(currentData, function(d){
  			setLines(d);
  	});
  	search_Locus(currentData);

}

function filterByGenome(curData, specificGenomes){

	newGenomes = {};
	newGenomes.Genomes = [];
	for (i in specificGenomes){
		newGenomes.Genomes.push(curData.Genomes[parseInt(specificGenomes[i])-1]);
	}
	currentData.Genomes = newGenomes.Genomes;
	d3.selectAll('svg').remove();
	setScale(currentData, function(d){
  			setLines(d);
  	});
  	search_Locus(currentData);

}

function removeFilters(){
	currentData.Genomes = globalData.Genomes;
	d3.selectAll('svg').remove();
	setScale(currentData, function(d){
  			setLines(d);
  	});
  	search_Locus(currentData);
}


function addFilter(newSearch){
	countFilters += 1;
	divSearches = $('#AllFilters');
	toAppend = ('<div id="filter_' + newSearch.replace(/\./g,'_') + '">' + newSearch + '</div>');
	divSearches.append(toAppend);
}

