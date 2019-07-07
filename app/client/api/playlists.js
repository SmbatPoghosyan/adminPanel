function getAllPlaylists(self){
    axios.get('http://localhost:8000/playlists/', {

    })
        .then(response => {
            self.setState({
                playlists: response.data.playlists,
            });
        })
        .catch(error => {
        });
}

function getPlaylistWithTwoScreens(self){
    axios.get('http://localhost:8000/playlists/with2screens', {
    })
        .then(response => {

            self.setState({
                playlists: response.data.playlists,
            });

        })
        .catch(error => {
        });
}