import React from 'react';
import UseSiteMetadata from './components/Main'
import { useStaticQuery, graphql } from "gatsby"

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeData: [],
      language: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        Title: <h2>{this.state.homeData.title}</h2> 
        <br></br>
        Description: <h3>{this.state.homeData.description}</h3>
        <br></br>

        <form onSubmit={this.handleSubmit}>
            <select value={this.state.language} onChange={this.handleChange}>
              <option value="ua">Ukrainian</option>
              <option value="">English</option>
              <option value="ru">Russian</option>
            </select>
        <input type="submit" value="Send" />
        </form>
      </div>
    )
  }

  loadData = () => {
    fetch('http://localhost:53565/' + localStorage.getItem("language") + '/home-child')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({homeData: result});
    })
  }

  componentDidMount() {
    this.loadData();
  }

  handleSubmit(event) {
    this.loadData();
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({language: event.target.value});
    localStorage.setItem("language", this.state.language);
  }
}

export default HomePage