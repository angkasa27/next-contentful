import { createClient } from "contentful";
import Card from "../components/Card";

export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: "recipe" });

  return {
    props: {
      data: res.items,
    },
  };
}

export default function Recipes({ data }) {
  return (
    <div className="recipe-list">
      {data.map((v) => (
        <Card key={v.sys.id} data={v} />
      ))}

      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  );
}
