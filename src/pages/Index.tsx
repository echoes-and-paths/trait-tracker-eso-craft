import { useActiveCharacter } from "@/lib/useActiveCharacter";
import { ESOCraftingTracker } from '../components/ESOCraftingTracker';


const Index = () => {

  const { character, loading } = useActiveCharacter();



  if (loading) return (<p style={{textAlign:"center",marginTop:"40px"}}>Loading…</p>);

  if (!character) return (

    <div style={{textAlign:"center",marginTop:"40px"}}>

      <p>No character selected.</p>

      <a href="/characters">Go pick or add one</a>

    </div>

  );



  return (

    <div style={{textAlign:"center",marginTop:"40px"}}>

      <h2>{character.name}</h2>

      <p>Trait grid will go here.</p>

    </div>

  );

};

export default Index;
