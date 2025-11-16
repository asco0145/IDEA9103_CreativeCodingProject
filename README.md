# IDEA9103_CreativeCodingProject

# Instructions 
Press the “Play / Pause” button in the top-left corner to start the music. As the music plays: The guy (screaming figure) gradually appears and reacts dynamically to the loudness of the sound. The background dots and strokes continue animating gently. A mini circular sound visualiser appears in the bottom-right corner, showing the frequency spectrum of the audio in real time. The full effect is audio-driven.

# Individual approach  
My approach focuses on transforming the original group artwork into an audio-reactive visual experience. I chose to animate the work using sound as the main driver, specifically amplitude (volume) and FFT (frequency spectrum). My individual contribution enhances the emotional impact of The Scream by visually expressing the tension, volume, and timbre of the music through, pixel bursts,dynamic dot patterns, a circular frequency wheel and amplitude-based size and movement changes

# References/Inspiration
My animation was primarily inspired by the Week 11 sound–visualisation exercises, where we experimented with FFT and audio-reactive graphics. I was especially influenced by the idea of transforming static pixels into dynamic elements that respond in real time to sound. This led me to explore how audio frequency data and volume levels could drive movement, size, and pattern changes across The Scream.

As part of my individual contribution, I incorporated two sound-analysis tools from the p5.sound library, which were not fully covered in class. These tools allow the artwork to react dynamically to the audio track.

External references used:

p5.Amplitude – used to measure the overall loudness of the song in real time
https://p5js.org/reference/p5.sound/p5.Amplitude/

getLevel() – retrieves the current amplitude (volume) value each frame
https://p5js.org/reference/p5.Amplitude/getLevel/

These functions made it possible to animate the “guy” figure with pixel bursts that grow, shrink, and accelerate based on the changing volume of the music.
# Technical explanation 
I used let amp = new p5.Amplitude(); and let level = amp.getLevel(); to detect how load the music is 

Then use let levelNorm = map(level, 0, 0.3, 0, 1);
Level is passed to the GuyArea.drawPixels() method. the Louder the sound the bigger and more pixels.

Inside GuyArea.drawPixels() I added let pixelSize = this.basePixelSize + ampLevel * 16; let count = this.pixelsPerFrame + ampLevel * 300; Where ampLevel = levelNorm. Pixels form faster and larger when the music intensifies.

I then added a function drawMiniVisualizer(cx, cy, radius, spectrum, amplitude, centroidFreq) that uses Uses p5.FFT(), Draws spinning bars around a circle, Uses HSB colours, Adds an expanding colour-changing inner circle

I also used colorMode(HSB, 255); to creates smooth rainbow colouring based on frequency band index.

New Features Added by me on top of main:
Complete sound system (loadSound, play/pause, amplitude)
Amplitude normalization (levelNorm)
Audio-reactive GuyArea behaviour
Mini FFT wheel visualiser in corner
HSB-based colour mapping
Rearranged draw order so that my animations appear correctly on top
