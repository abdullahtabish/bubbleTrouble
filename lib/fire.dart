import 'package:flutter/material.dart';

class PlayerFire extends StatelessWidget {
  final fireX, fireHeight;

  PlayerFire({this.fireX, this.fireHeight});

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment(fireX, 1),
      child: Container(
        width: 2,
        height: fireHeight,
        color: Colors.grey,
      ),
    );
  }
}
