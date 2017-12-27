metadata = require("./metadata");

const TestSongs = [
	{name: "Trouble", artist: "Cage The Elephant"},
	{name: "Feel Good Inc.", artist: "The Gorrilaz"}
];

it("lastFmArtwork_songlist", (done) => {
	TestSongs.forEach(song => {
		metadata.lastFmArtwork(song.name, song.artist)
		.then((url) => {
			done()
		})
		.catch((error) => {
			done()
		})
	});
});