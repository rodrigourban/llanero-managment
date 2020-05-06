import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import './search.scss'
import styled from "styled-components";

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #e85a4f;
  /* Change width of the form depending if the bar is opened or not */
  width: ${props => (props.barOpened ? "30rem" : "2.2rem")};
  /* If bar opened, normal cursor on the whole form. If closed, show pointer on the whole form so user knows he can click to open it */
  cursor: ${props => (props.barOpened ? "auto" : "pointer")};
  height: 2.2rem;
  border-radius: 10rem;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
`;

const Input = styled.input`
  font-size: 14px;
  line-height: 1;
  background-color: transparent;
  width: 100%;
  margin-left: ${props => (props.barOpened ? "1rem" : "0rem")};
  border: none;
  color: white;
  transition: all 300ms cubic-bezier(0.645, 0.045, 0.355, 1);

  &:focus,
  &:active {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
`;

const Button = styled.button`
  line-height: 1;
  pointer-events: ${props => (props.barOpened ? "auto" : "none")};
  cursor: ${props => (props.barOpened ? "pointer" : "none")};
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
`;

const Search = props => {
  const [input, setInput] = useState("");
  const [barOpened, setBarOpened] = useState(false);
  const [timet, setTimet] = useState(null);
  const formRef = useRef();
  const inputFocus = useRef();

  useEffect(() => {
    // add when mounted
    document.addEventListener("mousedown", handleClick);
    // cleanup event when unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const handleInput = text => {
    //Change the value
    setInput(text);
    //If there was a timeout, clear it
    setTimet(clearTimeout(timet));
    //Set a timeout with a function that'll called
    //when the user stops typing
    //only if theres is text to search
    setTimet(
      setTimeout(function() {
        if (text) {
          props.onFilter(text);
        }
      }, 2000)
    );
  };

  // When user clicks outside of the form, set bar opened to false, to close it
  const handleClick = e => {
    if (formRef.current.contains(e.target)) {
      // click was inside form, do nothing
      return;
    }
    //Click outside the form, close it
    setBarOpened(false);
  };

  const onFormSubmit = e => {
    // When form submited, clear input, close the searchbar and do something with input
    e.preventDefault();
    //If there was a timeout, clear it
    setTimet(clearTimeout(timet));
    setInput("");
    setBarOpened(false);
    // After form submit, do what you want with the input value
    props.onFilter(input);
  };
  return (
    <form
      barOpened={barOpened}
      onClick={() => {
        // When form clicked, set state of baropened to true and focus the input
        setBarOpened(true);
        inputFocus.current.focus();
      }}
      // On submit, call the onFormSubmit function
      onSubmit={onFormSubmit}
      ref={formRef}
      className={`searchForm ${barOpened ? 'open' : ''}`}
    >
      <button type="submit" barOpened={barOpened} className={`searchButton ${barOpened ? 'open' : ''}`}>
        <i className="material-icons">search</i>
      </button>
      <input
        onChange={e => handleInput(e.target.value)}
        ref={inputFocus}
        value={input}
        barOpened={barOpened}
        placeholder="Type to search..."
        className={`searchInput ${barOpened ? 'open' : ''}`}
      />
    </form>
  );
};

Search.propTypes = {
  onFilter: PropTypes.func.isRequired
};

export default Search;
