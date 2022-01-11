import 'dart:async';
import 'dart:html';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'button.dart';
import 'fire.dart';
import 'player.dart';
import 'ball.dart';

class Homepage extends StatefulWidget {
  @override
  _HomepageState createState() => _HomepageState();
}

enum direction { LEFT, RIGHT }

class _HomepageState extends State<Homepage> {
  static double playerX = 0;

  bool gameStartedOrNot = false;

  double fireX = playerX;
  double fireHeight = 10;
  bool midShot = false;

  double ballX = 0.5;
  double ballY = 1;
  double ballSpeed = 0.005;
  var ballDirection = direction.LEFT;

  void startGame() {
    gameStartedOrNot = true;

    setState(() {
      Timer.periodic(Duration(seconds: 33), (timer) {
        ballSpeed = ballSpeed + 0.009;
      });
    });

    double time = 0;
    double height = 0;
    double velocity = 90;

    Timer.periodic(Duration(milliseconds: 10), (timer) {
      height = -5 * time * time + velocity * time;

      if (height < 0) {
        time = 0;
      }

      setState(() {
        ballY = heightToCoordinate(height);
      });

      if (ballX - ballSpeed < -1) {
        ballDirection = direction.RIGHT;
      } else if (ballX + ballSpeed > 1) {
        ballDirection = direction.LEFT;
      }

      if (ballDirection == direction.LEFT) {
        setState(() {
          ballX -= ballSpeed;
        });
      } else if (ballDirection == direction.RIGHT) {
        setState(() {
          ballX += ballSpeed;
        });
      }

      if (playerDies()) {
        timer.cancel();
        _showDialog();
      }

      time += 0.1;
    });
  }

  void _showDialog() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            backgroundColor: Colors.grey[700],
            title: Center(
              child: Text(
                "GAME OVER",
                style: TextStyle(
                  fontSize: 20.0,
                  fontFamily: 'PressStart2P',
                  color: Colors.white,
                  letterSpacing: 3.0,
                ),
              ),
            ),
            actions: <Widget>[
              Center(
                child: TextButton(
                  onPressed: () {
                    setState(() {
                      Navigator.pop(context);

                      playerX = 0;
                      fireX = playerX;
                      fireHeight = 10;
                      midShot = false;
                      ballX = 0.5;
                      ballY = 1;
                      ballSpeed = 0.005;
                      ballDirection = direction.LEFT;
                      startGame();
                    });
                  },
                  child: Text(
                    "Restart",
                    style: TextStyle(
                      color: Colors.white,
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
              ),
            ],
          );
        });
  }

  void moveLeft() {
    if (gameStartedOrNot) {
      setState(() {
        if (playerX - 0.1 < -1) {
        } else {
          playerX -= 0.1;
        }

        if (!midShot) {
          fireX = playerX;
        }
      });
    }
  }

  void moveRight() {
    if (gameStartedOrNot) {
      setState(() {
        if (playerX + 0.1 > 1) {
        } else {
          playerX += 0.1;
        }

        if (!midShot) {
          fireX = playerX;
        }
      });
    }
  }

  void fireUp() {
    if (gameStartedOrNot) {
      if (midShot == false) {
        Timer.periodic(Duration(milliseconds: 20), (timer) {
          midShot = true;

          setState(() {
            fireHeight += 10;
          });

          if (fireHeight > MediaQuery.of(context).size.height * 3 / 4) {
            resetFire();
            timer.cancel();
          }

          if (ballY > heightToCoordinate(fireHeight) &&
              (ballX - fireX).abs() < 0.03) {
            resetFire();
            ballX = 5;
            timer.cancel();
          }
        });
      }
    }
  }

  double heightToCoordinate(double height) {
    double totalHeight = MediaQuery.of(context).size.height * 3 / 4;
    double position = 1 - 2 * height / totalHeight;
    return position;
  }

  void resetFire() {
    fireX = playerX;
    fireHeight = 10;
    midShot = false;
  }

  bool playerDies() {
    if ((ballX - playerX).abs() < 0.05 && ballY > 0.95) {
      return true;
    } else {
      return false;
    }
  }

  bool trueOrFalse = true;

  @override
  Widget build(BuildContext context) {
    return Title(
      title: 'Bubble Trouble',
      color: Colors.black,
      child: RawKeyboardListener(
        focusNode: FocusNode(),
        autofocus: true,
        onKey: (event) {
          if (event.isKeyPressed(LogicalKeyboardKey.arrowLeft)) {
            moveLeft();
          } else if (event.isKeyPressed(LogicalKeyboardKey.arrowRight)) {
            moveRight();
          } else if ((event.isKeyPressed(LogicalKeyboardKey.space)) ||
              (event.isKeyPressed(LogicalKeyboardKey.arrowUp))) {
            fireUp();
          }
        },
        child: Column(
          children: [
            Expanded(
              flex: 3,
              child: Container(
                color: Colors.pink[100],
                child: Center(
                  child: Stack(
                    children: [
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 300.0),
                          child: Text(
                            'BUBBLE TROUBLE',
                            style: TextStyle(
                              fontSize: 20.0,
                              fontFamily: 'PressStart2P',
                              color: Colors.white,
                              letterSpacing: 3.0,
                              decoration: TextDecoration.none,
                            ),
                          ),
                        ),
                      ),
                      Center(
                        child: Padding(
                          padding:
                              const EdgeInsets.only(bottom: 200.0, right: 16.0),
                          child: Text(
                            '❤',
                            style: TextStyle(
                              fontSize: 20.0,
                              fontFamily: 'PressStart2P',
                              color: Colors.white,
                              letterSpacing: 3.0,
                              decoration: TextDecoration.none,
                            ),
                          ),
                        ),
                      ),
                      Center(
                        child: Padding(
                          padding:
                              const EdgeInsets.only(bottom: 100.0, right: 16.0),
                          child: TextButton(
                            onPressed: () {
                              setState(() {
                                if (trueOrFalse == true) {
                                  startGame();
                                  trueOrFalse = false;
                                }
                              });
                            },
                            child: Visibility(
                              visible: trueOrFalse,
                              child: Text(
                                'PLAY',
                                style: TextStyle(
                                  fontSize: 20.0,
                                  fontFamily: 'PressStart2P',
                                  color: Colors.white,
                                  letterSpacing: 3.0,
                                  decoration: TextDecoration.none,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      MyBall(ballX: ballX, ballY: ballY),
                      PlayerFire(fireX: fireX, fireHeight: fireHeight),
                      MyPlayer(playerX: playerX),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: Container(
                color: Colors.grey,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    MyButton(
                      arrowButton: Icons.arrow_back,
                      function: moveLeft,
                    ),
                    MyButton(
                      arrowButton: Icons.arrow_upward,
                      function: fireUp,
                    ),
                    MyButton(
                      arrowButton: Icons.arrow_forward,
                      function: moveRight,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
