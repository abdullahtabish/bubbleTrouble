import 'package:flutter/material.dart';

class MyPlayer extends StatelessWidget {
  final playerX;
  MyPlayer({required this.playerX});

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment(playerX, 1),
      child: Container(
        height: 80.0,
        width: 50.0,
        child: Image.asset('images/mainChar.png'),
      ),
    );
  }
}
