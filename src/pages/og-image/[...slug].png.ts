import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";
import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import { getAllPosts } from "@/data/post";
//import { siteConfig } from "@/site.config";
import { getFormattedDate } from "@/utils/date";
import { Resvg } from "@resvg/resvg-js";
import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";

const ogOptions: SatoriOptions = {
	// debug: true,
	fonts: [
		{
			data: Buffer.from(RobotoMono),
			name: "Roboto Mono",
			style: "normal",
			weight: 400,
		},
		{
			data: Buffer.from(RobotoMonoBold),
			name: "Roboto Mono",
			style: "normal",
			weight: 700,
		},
	],
	height: 630,
	width: 1200,
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#1d1f21] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6">${pubDate}</p>
			<h1 tw="text-4xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
	        <svg
            width="100"
            height="68.75"
            viewBox="0 0 105.38852 72.646561"
            version="1.1"
            id="svg1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg">
				<defs id="defs1" />
				<path
					style="font-weight:bold;font-family:'Nimbus Sans Narrow';-inkscape-font-specification:'Nimbus Sans Narrow Bold'"
					d="M 43.844284,1.1901855e-6 H 1.1138916e-6 V 72.70253 H 45.261882 V 59.84289 H 12.150842 V 41.009088 H 41.312859 V 28.149448 H 12.150842 V 12.859641 h 31.693442 z" 
					fill='#ff7f2a'
					id="path1" />
									
				<path
					style="font-weight:bold;font-family:'Nimbus Sans Narrow';-inkscape-font-specification:'Nimbus Sans Narrow Bold"
					d="m 55.387674,72.70253 h 12.15084 V 44.350569 h 12.859639 c 8.404332,0.202514 9.82193,2.328911 9.720673,13.770952 0.101257,6.885477 0.405028,10.429472 1.417598,14.581009 h 13.770956 v -1.923883 c -2.1264,-1.01257 -2.53143,-2.632682 -2.63269,-9.011874 0.10126,-17.011176 -0.91131,-20.352657 -7.594271,-23.896652 6.075421,-3.037711 9.214391,-8.80936 9.214391,-17.213691 C 104.29481,8.1005615 96.903045,1.1901855e-6 85.461004,1.1901855e-6 H 55.387674 Z M 67.538514,31.997214 V 12.454613 h 15.593579 c 5.670392,0 8.708102,3.442738 8.708102,9.821929 0,6.682962 -3.03771,9.720672 -9.619415,9.720672 z"
					fill='#53c68c'
					id="path2" />
        </svg>
			<div tw="flex items-center">
			</div>
			<p>by Emilian R.</p>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { pubDate, title } = context.props as Props;

	const postDate = getFormattedDate(pubDate, {
		month: "long",
		weekday: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Cache-Control": "public, max-age=31536000, immutable",
			"Content-Type": "image/png",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.id },
			props: {
				pubDate: post.data.updatedDate ?? post.data.publishDate,
				title: post.data.title,
			},
		}));
}
