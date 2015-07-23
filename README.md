# wgMLST_Representation

# Description 

This program allows the visualization of results obtained from an wgMLST allele calling method. Input is given in a JSON file format which can be acessed remotely (e.g Google Drive).


#JSON format

	"Genomes" : [
		{
			"Name" : "Genome1",
			"Size" : 123456,
			"Contigs": [
				{
					"Name" : "ContigName1",
					"Size" : 12345,
					"Locus" : [
								{
									"Name" : "LocusName1",
									"AlleleNumber" : 3,
									"StartAt" : 1900,
									"EndtAt" : 1900
								}
							  ]
				}
			]
		}

File url can be changed at `javascripts/createGraphs.js` at the `d3.json` method call.


#Dependencies used

* D3 https://github.com/mbostock/d3 - For visual representation
