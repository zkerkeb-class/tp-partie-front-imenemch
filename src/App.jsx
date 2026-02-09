import './App.css'

import Title from './components/title'
import Counter from './components/counter'
import PokeList from './components/pokelist'
function App() {

  return (
    <div>
      {/* <Title  label="Titre 1" />
      <Title label="Titre 2" />
      <Title label="Titre 3" />
      <Title label="Titre 4" />
      <Title/> */}
      <Counter/>
      <PokeList/>
    </div>
  )
}

export default App
