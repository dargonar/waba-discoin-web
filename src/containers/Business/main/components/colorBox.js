import React, { Component } from "react";

export class ColorBox extends Component {
  render() {
    return (
      <div
        style={{
          background: "#fff",
          marginTop: "20px",
          textAlign: "center",
          paddingTop: "30px"
        }}
      >
        <span
          style={{
            textTransform: "uppercase",
            display: "block",
            color: "#dcdcdc",
            fontSize: "14px",
            padding: "10px 0 0 0",
            fontWeight: "bold"
          }}
        >
          {this.props.title}
        </span>
        <div style={{background: "#fff"}}>
          <input
            style={{
              background: "#fff",
              border: "none",
              color: this.props.color || "#ccc",
              fontSize: "50px",
              borderBottom: `1px solid ${this.props.color || "#ccc"}`,
              margin: "0 auto 20px auto",
              textAlign: "center",
              width: "130px"
            }}
            value={this.props.value}
            onChange={e => this.props.onChange(e.target.value)}
          />
          <span style={{color: this.props.color || "#ccc", fontSize: "50px"}}>%</span>
        </div>
        {this.props.children}
        <button
          disabled={!this.props.valid}
          style={{
            border: "none",
            display: "block",
            width: "100%",
            background: this.props.color || "#e1e1e1",
            color: "#fff",
            textTransform: "uppercase",
            textAlign: "center",
            padding: "10px",
            fontSize: "20px",
            marginTop: "5px",
            opacity: this.props.valid ? 1 : 0.5,
            cursor: "pointer"
          }}
          onClick={this.props.onSubmit}
        >
          {this.props.buttonText}
        </button>
      </div>
    );
  }
}