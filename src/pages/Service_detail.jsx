import '../index.css'
import { useParams } from "react-router";

function Service_detail() {
  const params = useParams();
  const serviceId = params.id;

  return (
    <>
        <h1>Annonce</h1>
        <p>{serviceId}</p>
    </>
  )
}

export default Service_detail