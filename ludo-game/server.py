from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Add this new route
@app.route('/ludo')
def ludo():
    # Get parameters from URL
    n_playing = request.args.get('nPlaying', default=0, type=int)
    red_playing = request.args.get('redPlaying', default='false') == 'true'
    green_playing = request.args.get('greenPlaying', default='false') == 'true'
    yellow_playing = request.args.get('yellowPlaying', default='false') == 'true'
    blue_playing = request.args.get('bluePlaying', default='false') == 'true'
    
    return render_template(
        'ludo.html',
        nPlaying=n_playing,
        redPlaying=red_playing,
        greenPlaying=green_playing,
        yellowPlaying=yellow_playing,
        bluePlaying=blue_playing
    )

if __name__ == '__main__':
    app.run(debug=True)