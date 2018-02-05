Early beta version of online chess game. Fully playable but lacks many features I originally wanted to implement.

Disclaimer: game uses free versions of mongolab database and heroku hosting. There might be downtimes. If you can't play, please comeback later.

Features:

- Account based, you have to register before playing. Simply you have to choose login and password (data stored in database is encrypted, therefore safe)
- Game data is stored in database. During game, you can leave anytime you want and resume later.
- You can have max four games active simultaneously.
- During game you can replay any past move - simply click on appriopiate message on right side of screen.
- Tested and working in newest version of Chrome, FireFox, Edge and Opera (there might be minor styling differences though). Not designed for mobile.

Things left to do:

- Implement castling.
- Implement "check" and "check mate" condition (right now game ends when any king figure is captured).
- Implement draw condition.
- Implement pawn to queen promotion.
- Implement user statistics.
- Better styling (right now styles are somewhat rudimentary).
- Further styling (implement styled scrollbars working in all browsers).
- Error handling.

Author: Lukasz Lach (mietek76<at>gmail.com)