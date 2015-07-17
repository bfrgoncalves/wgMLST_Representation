var optArray = [];
var inSearch = [];
countSearches = 0;

var search_Locus= function(data){

	for (i in data.Genomes){
		Contigs = data.Genomes[i].Contigs;
		for (j in Contigs){
			Locus = Contigs[j].Locus;
			for (y in Locus){
				if($.inArray(Locus[y].Name, optArray) === -1) optArray.push(Locus[y].Name);
			}
		}
	}
	optArray = optArray.sort();
}

$(function () {
    $("#Locusid").autocomplete({
        source: optArray
    });
});

function highlightLocus(locusId){

	toSearch = '.' + locusId.replace(/\./g,'_').replace(/\:/g,'__');
	
	if($.inArray(toSearch , inSearch) === -1) {
		if (countSearches == 0) d3.selectAll('svg g g g rect').attr('opacity',0.01);
		d3.selectAll(toSearch).attr('opacity',1.0);

		inSearch.push(toSearch);
		addSearch(toSearch);
	}
}

function removeSearches(){

	d3.selectAll('svg g g g rect').attr('opacity',1.0);
	countSearches = 0;
	$('#AllSearches').empty();
	inSearch = [];
	
}

function removeSearch(element){
	locusName = element.split('button_')[1];
	countSearches -= 1;
	$('#search_'+locusName).remove();
	if (countSearches == 0) d3.selectAll('svg g g g rect').attr('opacity',1.0);
	else d3.selectAll(locusName.replace('_','\.')).attr('opacity',0.01);

	var index = inSearch.indexOf(locusName);
	inSearch.splice(index,1);

}

function addSearch(newSearch){
	countSearches += 1;
	divSearches = $('#AllSearches');
	toAppend = ('<div id="search_' + newSearch.replace(/\./g,'_') + '">' + newSearch + '<button class="btn btn-default" id="button_' + newSearch.replace(/\./g,'_') + '" onclick="removeSearch(this.id)">Remove</button></div>');
	divSearches.append(toAppend);
}
