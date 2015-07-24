var yScale, svgDefaultWidth = $('#graphicArea').width(), svgHeight = $('#graphicArea').height(), start = 0, Locusheight = 30;

var svgWidth = svgDefaultWidth;

var globalData = {};

var currentData;
var currentSearchMethod = 'Name';

var zoom = d3.behavior.zoom()
    .on("zoom", zoomed);

var divSliderHeight = $('#SizeAttributes').height();

$('#SizeAttributes').css('width', divSliderHeight);

function main(){
	d3.json("https://googledrive.com/host/0Bw6VuoagsdhmSS1PWUg3OWhfeEE", function(error, json) {
  		if (error) return console.warn(error);
  		globalData.Genomes = json.Genomes;
  		currentData = json;
  		console.log(currentData);
  		setScale(currentData, function(d){
  			setLines(d);
  		});
  		search_Locus(currentData, currentSearchMethod);
  		filterByName(currentData);
  		setTypeSearches();
	});

	$('#searchForm').submit(function(e) {
                          e.preventDefault();
                          var LocusId = $('#Locusid').val();
                          var typeSearch = $( "#selectList option:selected" ).text();
                          searchForLocus(LocusId, typeSearch);
                      });

	$('#filterForm').submit(function(e) {
                          e.preventDefault();
                          var query = $('#filterTextpart').val();
                          if (query != '') filterJson(currentData, query);
                          else{
                          	toQuery = '';
                          	$( "#filterByName option:selected" ).each(function(i, selected){
                          		toQuery += String($(selected)[0].value) + ',';
                          	});
                          	toQuery = toQuery.substring(0, toQuery.length - 1);
                          	filterJson(currentData, toQuery);
                          }
                      });

	$('#selectList').change(function(e) {
                          var selectValue = $( "#selectList option:selected" ).text();
                          currentSearchMethod = selectValue;
                          $('#Locusid').val('');
                          search_Locus(currentData, currentSearchMethod);

                      });

	$('#filterByName').change(function(e) { $('#filterTextpart').val(''); });
}

function setScale(data, callback){
	maxSize = 0;
	for (i in data.Genomes){
		if (data.Genomes[i].Size > maxSize) maxSize = data.Genomes[i].Size;
	}
	sizeScale = d3.scale.linear().domain([0, maxSize]).range([start, svgWidth]);
	callback(data);
}
//d3.scale.linear().domain([0, data.length]).range([h, 0]);


function setLines(data){
	svg = d3.select('#graphicArea').append('svg').attr('width', svgWidth).attr('height', svgHeight).call(zoom).append('g');
	countGenomesY1 = -1;
	countGenomesY2 = -1;
	height = 20;
	ContigInterval = 300;
	genomeInterval = 20;
	countLines = 0;
	lineID = '';
	genomeToIndex = {};


	for (i in data.Genomes){
		countContigs1 = 0;
		countContigs2 = 0;
		countContigs3 = 0;
		countContigs4 = 0;
		countContigs5 = 0;
		currentX = 0;
		currentY = 0;
		countGenomesY1 += 2;
		countGenomesY2 += 2;
		prevX1 = 0;
		prevX2 = 0;
		prevSize = 0;
		genomeToIndex[data.Genomes[i].Name] = i;

		genomeGroups = svg.append('g')
						.attr('id', function(){
									countLines += 1;
									return 'group_' + String(countLines);
						});

		text = genomeGroups.selectAll("text")
                        .data([data.Genomes[i].Name])
                        .enter()
                        .append('g')
                        .append("text")
                        .text( function (d) { return d; })
                        .attr("x", function(d) { return -250; })
                 		.attr("y", function(d) { return (height + genomeInterval) * countGenomesY1; })
						.attr("font-family", "sans-serif")
                 		.attr("font-size", "20px")
                 		.attr("fill", "black")
                 		.on('click', function(d){
                 			showGenomeInfo(genomeToIndex[d]);
                 		});

		currentLines = genomeGroups.selectAll('line')
							.data(data.Genomes[i].Contigs)
							.enter()
							.append('g')
							.attr('id', function(){
										countContigs1 += 1;
										return 'Contig_'+String(countLines)+'_'+String(countContigs1);
							})
							.append('line')
							.attr('x1', function(d){
								if (countContigs2 != 0) Toreturn = sizeScale(parseInt(ContigInterval) + parseInt(prevSize));
								else{
									Toreturn = sizeScale(parseInt(ContigInterval));
									prevSize = 0;
								} 
								countContigs2 += 1;
								prevSize += parseInt(d.Size);
								return Toreturn;
							})
							.attr('x2', function(d){
								if (countContigs3 != 0) Toreturn = sizeScale(parseInt(prevSize) + parseInt(d.Size));
								else{
									Toreturn = sizeScale(parseInt(d.Size));
									prevSize = 0;
								} 
								countContigs3 += 1;
								prevSize += parseInt(d.Size);
								return Toreturn;
							})
							.attr('y1', function(d){
								currentY = (height + genomeInterval) * countGenomesY1;
								return (height + genomeInterval) * countGenomesY1;
							})
							.attr('y2', function(d){
								return (height + genomeInterval) * countGenomesY2;
							})
							.attr("stroke-width", 2)
					        .attr("stroke", "red");

		
		currentContigs = svg.select('#group_' + String(countLines));

		prevLocation = ContigInterval;

		for(j in data.Genomes[i].Contigs){
			

			contig = data.Genomes[i].Contigs[j];
			isReverse = contig.Reverse;
			contigSize = parseInt(contig.Size);
			toSearch = '#Contig_' + String(parseInt(i)+1) + '_' + String(parseInt(j)+1);
			currentX = sizeScale(prevLocation);
			LocusPositionScale = d3.scale.linear().domain([0, contigSize]).range([currentX, sizeScale(prevLocation + contigSize)]);
			LocusGroup = currentContigs.selectAll(toSearch).append('g').attr('class','LocusGroup');
			countLocus = 0;

			LocusGroup.selectAll(toSearch)
				.data(data.Genomes[i].Contigs[j].Locus)
				.enter()
				.append('rect')
				.attr('class', function(d){ return d.Name.replace(/\./g,'_').replace(/\:/g,'__');})
				.attr('id', function(){
					var id = String(i) + '--' + String(j) + '--' + String(countLocus);
					countLocus += 1;
					return id;
				})
				.attr('x', function(d){ 

					if (parseInt(d.EndtAt) < parseInt(d.StartAt)){
						if (isReverse == true) {
							return LocusPositionScale(parseInt(d.EndtAt));
						}
						else return LocusPositionScale(parseInt(d.EndtAt));
					}
					else return LocusPositionScale(parseInt(d.StartAt)); })
				.attr('y', currentY-Locusheight/2)
				.attr('width', function(d){ 
					if (parseInt(d.EndtAt) < parseInt(d.StartAt)) return sizeScale(parseInt(d.StartAt) - parseInt(d.EndtAt));
					
					else return sizeScale(parseInt(d.EndtAt)-parseInt(d.StartAt));
 				})
				.attr('height', Locusheight)
				.on('mouseover', function(d){
					highlightSameName(d);
				})
				.on("mouseout", function(d) {
            		defaultColor(d);
        		})
				.on('click', function(d){
					showInfo(this.id);	
				});

			prevLocation += contigSize;
		}

		


	}

}

function zoomed() {
 svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function showInfo(locusId){
	console.log(locusId);
	splitId = locusId.split('--');
	GenomeId = parseInt(splitId[0]);
	ContigId = parseInt(splitId[1]);
	LocusId = parseInt(splitId[2]);
	genome = currentData.Genomes[GenomeId];
	contig = genome.Contigs[ContigId];
	locus = contig.Locus[LocusId];
	$('#clearButton').css('opacity',1.0);
	toShow = '<br> Genome: ' + genome.Name + '<br> Contig: ' + contig.Name + '<br> Contig Size: ' + contig.Size + '<br> Locus Name: ' + locus.Name + '<br> Alias: ' + locus.Alias + '<br> Start at Contig: ' + locus.StartAt + '<br> End at Contig: ' + locus.EndtAt + '<br> Description: ' + locus.Description;
	$('#infoPlace').append('<p>----------------------' + toShow + '</p>');
}

function showGenomeInfo(genomeIndex){
	genome = currentData.Genomes[genomeIndex];
	$('#clearButton').css('opacity',1.0);
	toShow = '<br> Name: ' + genome.Name + '<br> Number of Contigs: ' + String(genome.Contigs.length) + '<br> Size: ' + genome.Size;
	$('#infoPlace').append('<p>----------------------' + toShow + '</p>');
}

function clearInfo(){
	$('#clearButton').css('opacity',0.0);
	$('#infoPlace').empty();
}

function highlightSameName(locus){
	toSearch = '.' + locus.Name.replace(/\./g,'_').replace(/\:/g,'__');
	d3.selectAll(toSearch).attr('fill', 'blue');
}

function defaultColor(locus){
	toSearch = '.' + locus.Name.replace(/\./g,'_').replace(/\:/g,'__');
	d3.selectAll(toSearch).attr('fill', 'black');
}

function ChangeScale(value){
	svgWidth = svgDefaultWidth * parseInt(value);
	$('#currentScale').text(String(value) + 'x');
	d3.selectAll('svg').remove();
	setScale(currentData, function(d){
  			setLines(d);
  	});
}

