import { createClient } from "contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Skeleton from "../../components/Skeleton";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "recipe",
  });

  const paths = res.items.map((v) => {
    return {
      params: { slug: v.fields.slug },
    };
  });

  return {
    paths,
    fallback: true, //jika halaman dituju tidak ada dalam page akan diarahkan ke fallback
  };
};

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });

  // cek jika tidak ada item
  if (!items.length) {
    return {
      redirect: {
        destination: "/404",
        permanent: false, //Jaga jika akan ada id yang baru
      },
    };
  }

  return {
    props: {
      data: items[0],
    },
    revalidate: 1,
  };
}

export default function RecipeDetails({ data }) {
  if (!data) return <Skeleton />;

  const { featuredImage, title, cookingTime, ingredients, method } =
    data.fields;

  return (
    <div>
      <div className="banner">
        <Image
          src={"https:" + featuredImage.fields.file.url}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2> {title}</h2>
      </div>
      <div className="info">
        <p>Take about {cookingTime} mins to cook.</p>
        <h3>Ingredients</h3>
        {ingredients.map((v) => (
          <span key={v}>{v}</span>
        ))}
        <div className="method">
          <h3>Method</h3>
          <div>{documentToReactComponents(method)}</div>
        </div>
      </div>
      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
}
