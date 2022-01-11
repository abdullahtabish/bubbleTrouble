import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
  final arrowButton;
  final function;
  MyButton({this.arrowButton, this.function});
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: function,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(10.0),
        child: Container(
          width: 50.0,
          height: 50.0,
          color: Colors.grey[100],
          child: Center(
            child: Icon(arrowButton),
          ),
        ),
      ),
    );
  }
}
