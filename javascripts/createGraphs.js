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
					"BeginAtReferenceGenome" : 12,
					"EndAtReferenceGenome" : 4567,
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
					"BeginAtReferenceGenome" : 40,
					"EndAtReferenceGenome" : 5000,
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

function main(){
	setRect();
}

function setRect(){
	console.log(data);
	svg = d3.select('body').append('svg').attr('width', 500).attr('height', 500)
	countGenomes = -1;
	height = 100;
	genomeInterval = 20;
	
	rectangules = svg.selectAll('rect')
		.data(data.AlignedGenomes)
		.enter()
		.append('rect')
		.attr('x', function(d){
			return 10;
		})
		.attr('y', function(d){
			countGenomes += 1;
			return (height + genomeInterval) * countGenomes;
		})
		.attr('width', function(d){
			return d.Size;
		})
		.attr('height', function(d){
			return height;
		});
}