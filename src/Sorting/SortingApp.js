import React from "react"
import { IconButton } from "@material-ui/core"
import { Buttons } from "../components/Header.style"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

// importing the buttons
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  RotateLeft,
} from "@material-ui/icons"
import Bar from "../components/Bar"
import Form from "../components/Form"

// style
import "./SortingApp.css"
import index from "../components/Navbar/index"
// algorithms
import bubbleSort from "../algorithms/bubbleSort"
import mergeSort from "../algorithms/mergeSort"
import quickSort from "../algorithms/quickSort"
import insertionsort from "../algorithms/insertionsort"
import selectionsort from "../algorithms/selectionsort"
import countingSort from "../algorithms/countingSort"
import { Button } from "react-scroll"
class SortingApp extends React.Component {
  state = {
    array: [],
    colorKey: [],
    arraySteps: [],
    colorSteps: [],
    currentStep: 0,
    timeouts: [],
    algorithm: "Bubble Sort",
    barCount: 15,
    delay: 200,
  }

  ALGO_SET = {
    "Bubble Sort": bubbleSort,
    "Merge Sort": mergeSort,
    "Quick Sort": quickSort,
    "Insertion Sort": insertionsort,
    "Selection Sort": selectionsort,
    "Counting Sort": countingSort,
  }

  componentDidMount() {
    this.generateBars()
  }

  generateSteps = () => {
    let array = this.state.array.slice()
    let steps = this.state.arraySteps.slice()
    let colorSteps = this.state.colorSteps.slice()

    this.ALGO_SET[this.state.algorithm](array, 0, steps, colorSteps)

    this.setState({
      arraySteps: steps,
      colorSteps: colorSteps,
    })
  }

  setTimeouts() {
    let steps = this.state.arraySteps
    let colorSteps = this.state.colorSteps

    this.clearTimeouts()
    let timeouts = []
    let i = 0

    while (i < steps.length - this.state.currentStep) {
      let timeout = setTimeout(() => {
        let currentStep = this.state.currentStep
        this.setState({
          array: steps[currentStep],
          colorKey: colorSteps[currentStep],
          currentStep: currentStep + 1,
        })
      }, this.state.delay * i)
      timeouts.push(timeout)
      i++
    }

    this.setState({
      timeouts: timeouts,
    })
  }

  stepBack = () => {
    if (this.state.currentStep === 0) return
    this.clearTimeouts()

    let currentStep = this.state.currentStep - 1
    this.setState({
      array: this.state.arraySteps[currentStep],
      colorKey: this.state.colorSteps[currentStep],
      currentStep: currentStep,
    })
  }

  stepForward = () => {
    if (this.state.currentStep >= this.state.arraySteps.length - 1) return
    this.clearTimeouts()

    let currentStep = this.state.currentStep + 1
    this.setState({
      array: this.state.arraySteps[currentStep],
      colorKey: this.state.colorSteps[currentStep],
      currentStep: currentStep,
    })
  }

  changeAlgorithm = (event) => {
    this.setState(
      {
        algorithm: event.target.value,
        currentStep: 0,
        arraySteps: [
          this.state.arraySteps[
            this.state.currentStep === 0 ? 0 : this.state.currentStep - 1
          ],
        ],
      },
      () => this.generateSteps()
    )
    this.clearTimeouts()
    this.clearColorKey()
  }

  changeBarCount = (barCount) => {
    this.setState({ barCount: barCount }, () => this.generateBars())
  }

  changeDelay = (event) => {
    this.clearTimeouts()
    this.setState({
      delay: parseInt(event.target.value),
    })
  }

  clearTimeouts = () => {
    this.state.timeouts.forEach((timeout) => clearTimeout(timeout))
    this.setState({
      timeouts: [],
    })
  }

  clearColorKey = () => {
    let blankKey = new Array(parseInt(this.state.barCount)).fill(0)
    this.setState({
      colorKey: blankKey,
      colorSteps: [blankKey],
    })
  }

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     arrayInput: null,
  //   }
  // }

  // handleSubmit = (event) => {
  //   event.preventDefault()
  //   this.setState({
  //     [event.target.arrayInput]: event.target.value,
  //   })
  // }

  // handleInputChange = (event) => {
  //   event.preventDefault()
  // }

  generateBars = () => {
    this.clearTimeouts()
    this.clearColorKey()

    let barCount = parseInt(this.state.barCount)
    let barsTemp = []

    for (let i = 0; i < barCount; i++) {
      barsTemp.push(Math.floor(Math.random() * 350) + 10)
    }

    this.setState(
      {
        array: barsTemp,
        arraySteps: [barsTemp],
        barCount: barCount,
        currentStep: 0,
      },
      () => this.generateSteps()
    )
  }

  render() {
    let barsDiv = this.state.array.map((value, index) => (
      <Bar key={index} length={value} colorKey={this.state.colorKey[index]}>
        {<Buttons>{value}</Buttons>}
      </Bar>
    ))
    let playButton

    // Set player controls
    if (
      this.state.timeouts.length !== 0 &&
      this.state.currentStep !== this.state.arraySteps.length
    ) {
      playButton = (
        <IconButton onClick={() => this.clearTimeouts()}>
          <Pause />
        </IconButton>
      )
    } else if (this.state.currentStep === this.state.arraySteps.length) {
      playButton = (
        <IconButton color="secondary" onClick={() => this.generateBars()}>
          <RotateLeft />
        </IconButton>
      )
    } else {
      playButton = (
        <IconButton color="secondary" onClick={() => this.setTimeouts()}>
          <PlayArrow />
        </IconButton>
      )
    }

    return (
      <div className="App">
        <Navbar />
        <section className="bars container card">{barsDiv}</section>
        {/* <section className="inputform">
          <p>Array is : {arrayInput}</p>
          <form onSubmit={this.handleSubmit}>
            <p>
              <input
                type="number"
                value={arrayInput}
                placeholder="Array"
                name="arrayInput"
                onchange={this.handleInputChange}
              />
            </p>
            <p>
              <button>Add</button>
            </p>
          </form>
        </section> */}

        <section className="container-small">
          <IconButton onClick={() => this.generateBars()}>
            <RotateLeft />
          </IconButton>
          <IconButton onClick={this.stepBack}>
            <SkipPrevious />
          </IconButton>
          {playButton}
          <IconButton onClick={this.stepForward}>
            <SkipNext />
          </IconButton>
          <IconButton />
        </section>

        <section className="controls container-small">
          <Form
            formLabel="Algorithm"
            values={[
              "Bubble Sort",
              "Merge Sort",
              "Quick Sort",
              "Insertion Sort",
              "Selection Sort",
              "Counting Sort",
            ]}
            labels={[
              "Bubble Sort",
              "Merge Sort",
              "Quick Sort",
              "Insertion Sort",
              "Selection Sort",
              "Counting Sort",
            ]}
            currentValue={this.state.algorithm}
            onChange={this.changeAlgorithm}
          />

          <Form
            formLabel="Array size"
            values={[5, 10, 25, 50, 75, 100]}
            labels={[
              "5 items",
              "10 items",
              "25 items",
              "50 items",
              "75 items",
              "100 items",
            ]}
            currentValue={this.state.barCount}
            onChange={(e) => this.changeBarCount(e.target.value)}
          />

          <Form
            formLabel="Speed"
            values={[500, 100, 50]}
            labels={["1x", "2x", "4x"]}
            currentValue={this.state.delay}
            onChange={this.changeDelay}
          />
        </section>
      </div>
    )
  }
}

export default SortingApp
