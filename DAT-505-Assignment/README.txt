********************************************************
DAT-505-Advanced-Creative-Coding  // Thomas Kerslake
********************************************************

--- Github link [ https://github.com/ThomasKerslake/DAT-505 ]
--- Live project link (github pages) [ https://thomaskerslake.github.io/ ]
--- CodePen link [ https://codepen.io/thomaskerslake/ ]

//How to use my audio visualization

Loading up index on a local server will take the user to a page where they select which audio visualization
they want to view (the middle design is my most recent design 'index2.html' / index2.js).

From there they will be given the option to choose a quality in which
they want to view the visualization. For lower end systems, choose the lower qualities.

The user is now able to select any song they want by clicking anywhere on
the screen to select a file from their system. I have included some
music to test within my project (located in folder -> music).

*******************************************************************************************
Songs 4 and 1 are the best for this visualization as I have stlyed this project around them.
*******************************************************************************************

If the visualization is not playing there is a �fall-back� button you can click at
the top middle of your screen. I have not had to use this yet, but I chose to implemented it just in case.
(This will disappear after 5 seconds if it�s not clicked. This is to remove elements off screen
that may impact the viewing experience).

In the top left of the page you can hover your mouse to fade in the audio controls for the selected file.
From there the user can move through the song, play, pause and adjust the volume.

Once the user has selected a song they are able to adjust how the
visualization looks by altering the Postprocessing affects via the DAT-GUI. Using the DATGUI gives the
user the ability to choose what Postprocessing effect they want to view the project with (Afterimage, Bloom or TAA).
There are also options to adjust how individual Post Processing effects are styled.

Furthermore the user can also move around the scene by clicking and moving their mouse anywhere on screen.
