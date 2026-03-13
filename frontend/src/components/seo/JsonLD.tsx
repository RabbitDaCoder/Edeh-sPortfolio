import { Helmet } from "react-helmet-async";

export function JsonLD({ schema }: { schema: object }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
