import React, { Component } from "react";
import { Icon } from "antd";

export class ColorBox extends Component {
  render() {
    return (
      <div
        style={{
          background: "#fff",
          marginTop: "40px",
          textAlign: "center",
          borderRadius: "7px",
          overflow: "hidden",
          boxShadow: "rgba(222, 235, 255, 0.6) 4px 4px 24px",
        }}
      >
        <span
          style={{
            textTransform: "uppercase",
            display: "block",
            color: "#A4A4A4",
            fontSize: "14px",
            padding: "20px 0 0 0",
            fontWeight: "bold"
          }}
        >
          {this.props.title}
        </span>
        <div style={{background: "#fff"}}>
          <span style={{color: this.props.color || "#ccc", fontSize: "2.5rem", fontWeight:"100", verticalAlign:"text-bottom"}}>%</span>
          <input
            style={{
              background: "#fff",
              border: "none",
              lineHeight: "5rem",
              color: this.props.color || "#ccc",
              fontSize: "5.5rem",
              fontWeight: "100",
              textAlign: "center",
              width: "130px"
            }}
            value={this.props.value}
            onChange={e => this.props.onChange(e.target.value)}
          />
        </div>
        {this.props.children}
        <button
          disabled={!this.props.valid}
          style={{
            border: "none",
            display: "block",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            position: "absolute",
            background: this.props.color || "#e1e1e1",
            color: "#fff",
            textTransform: "uppercase",
            textAlign: "center",
            padding: "10px",
            fontSize: "20px",
            marginTop: "5px",
            opacity: this.props.valid ? 1 : 0.5,
            cursor: "pointer",
            bottom: "-60px",
            left: "0",
            right: "0",
            margin: "auto",
            boxShadow: "5px 6px 34px rgba(0,0,0,0.15)"
          }}
          onClick={this.props.onSubmit}
        >
          <Icon type={this.props.arrow} style={{ fontSize: '40px', color: '#fff' }} />
          
        </button>
      </div>
    );
  }
}
