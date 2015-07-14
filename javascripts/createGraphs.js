var data = {
	"ReferenceGenome" : [
		{
			"Name"  : "RefName",
			"Begin" : 0,
			"End"	: 1234567,
			"Locus" : [
				{
					"Name" : "LocusName1",
					"BeginAtReference" : 20,
					"EndAtReference" : 1890
				},
				{
					"Name" : "LocusName2",
					"BeginAtReference" : 2560,
					"EndAtReference" : 3300
				}
			]
		}
	],

	"AlignedGenomes" : [
		{
			"Name" : "AlignedGenome1",
			"Size" : 123456,
			"Contigs": [
				{
					"Name" : "ContigName1",
					"BeginAtReferenceGenome" : 500,
					"EndAtReferenceGenome" : 45671,
					"Locus" : [
								{
									"Name" : "LocusName1",
									"AlleleNumber" : 3,
									"BeginAtContig" : 15,
									"EndAtContig" : 1900
								},
								{
									"Name" : "LocusName2",
									"AlleleNumber" : 2,
									"BeginAtContig" : 2000,
									"EndAtContig" : 3870
								}
							  ]
				}
			]
		},

		{
			"Name" : "AlignedGenome2",
			"Size" : 154678,
			"Contigs": [
				{
					"Name" : "ContigName1",
					"BeginAtReferenceGenome" : 5000,
					"EndAtReferenceGenome" : 123456,
					"Locus" : [
								{
									"Name" : "LocusName1",
									"AlleleNumber" : 4,
									"BeginAtContig" : 100,
									"EndAtContig" : 2000
								},
								{
									"Name" : "LocusName2",
									"AlleleNumber" : 7,
									"BeginAtContig" : 2200,
									"EndAtContig" : 4300
								}
							  ]
				}

			]
		}
	]
}

var yScale, svgWidth = 1000, svgHeight = 1000, start = 0, Locusheight = 30;

function main(){
	setScale(setLines);
}

function setScale(callback){
	maxSize = 0;
	for (i in data.AlignedGenomes){
		if (data.AlignedGenomes[i].Size > maxSize) maxSize = data.AlignedGenomes[i].Size;
	}
	sizeScale = d3.scale.linear().domain([0, maxSize]).range([start, svgWidth]);
	callback();
}
//d3.scale.linear().domain([0, data.length]).range([h, 0]);


function setLines(){
	console.log(data);
	svg = d3.select('body').append('svg').attr('width', svgWidth).attr('height', svgHeight)
	countGenomesY1 = -1;
	countGenomesY2 = -1;
	height = 20;
	genomeInterval = 20;
	countLines = 0;
	lineID = '';

	for (i in data.AlignedGenomes){
		countContigs = 0;
		currentX = 0;
		currentY = 0;

		genomeGroups = svg.append('g')
						.attr('id', function(){
									countLines += 1;
									return 'group_' + String(countLines);
						});

		currentLines = genomeGroups.selectAll('line')
							.data(data.AlignedGenomes[i].Contigs)
							.enter()
							.append('g')
							.attr('id', function(){
										countContigs += 1;
										return 'Contig_'+String(countLines)+'_'+String(countContigs);
							})
							.append('line')
							.attr('x1', function(d){
								return sizeScale(d.BeginAtReferenceGenome);
							})
							.attr('x2', function(d){
								return sizeScale(d.EndAtReferenceGenome);
							})
							.attr('y1', function(d){
								countGenomesY1 += 2;
								currentY = (height + genomeInterval) * countGenomesY1;
								return (height + genomeInterval) * countGenomesY1;
							})
							.attr('y2', function(d){
								countGenomesY2 += 2;
								return (height + genomeInterval) * countGenomesY2;
							})
							.attr("stroke-width", 2)
					        .attr("stroke", "black");

		currentContigs = svg.select('#group_' + String(countLines));
		console.log(currentContigs);

		for(j in data.AlignedGenomes[i].Contigs){
			toSearch = '#Contig_' + String(parseInt(i)+1) + '_' + String(parseInt(j)+1);
			console.log(toSearch);
			currentX = sizeScale(data.AlignedGenomes[i].Contigs[j].BeginAtReferenceGenome);
			LocusGroup = currentContigs.selectAll(toSearch).append('g');

			LocusGroup.selectAll(toSearch)
				.data(data.AlignedGenomes[i].Contigs[j].Locus)
				.enter()
				.append('rect')
				.attr('x', function(d){ return sizeScale(currentX + d.BeginAtContig); })
				.attr('y', currentY-Locusheight/2)
				.attr('width', function(d){ return sizeScale(d.EndAtContig-d.BeginAtContig); })
				.attr('height', Locusheight);
		}


	}

}
