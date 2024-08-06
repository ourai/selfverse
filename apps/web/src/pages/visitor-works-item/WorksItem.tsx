import { useParams } from 'react-router-dom';

function WorksItem() {
  const { id } = useParams();
  return <div>Paid works {id}</div>
}

export default WorksItem;
