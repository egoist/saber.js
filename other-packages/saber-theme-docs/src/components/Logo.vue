<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 402 402"
  >
    <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
      <circle cx="200" cy="200" r="200.5" fill="#00838F" stroke="#00838F" />
      <path
        fill="#FBB526"
        d="M152.842359,232.240687 L203.5,228 L213.023656,250 L180.330798,282.43453 L152.842359,321.07787 L156.470397,368 C129.583323,361.434315 111.677654,354.963171 102.753391,348.586566 C93.8291281,342.209961 84.2446643,333.040396 74,321.07787 L122,263.912735 L143,263.912735 L152.842359,232.240687 Z"
      />
      <rect width="120" height="14" x="143" y="131" fill="#FFF" />
      <rect width="12" height="83" x="171" y="145" fill="#FFF" />
      <rect width="12" height="105" x="224" y="145" fill="#FFF" />
      <rect width="12" height="40" x="196" y="185" fill="#FFF" />
      <rect width="33" height="40" x="187" y="91" fill="#FFF" />
      <circle cx="203" cy="78" r="18" stroke="#FFF" stroke-width="14" />
      <path stroke="#979797" />
      <circle cx="200" cy="200" r="179" stroke="#FFF" stroke-width="14" />
      <polyline
        stroke="#FFF"
        stroke-width="14"
        points="70 325.805 119.368 260 147.868 260"
      />
      <polyline
        stroke="#FFF"
        stroke-width="14"
        points="122 314.069 144.748 294.338 150.248 236.435 205.248 226 220 250"
      />
      <polyline
        stroke="#FFF"
        stroke-width="14"
        points="177 286.058 196 274.41 205.188 250 250.379 254.615 267.648 277.437"
      />
      <polyline
        stroke="#FFF"
        stroke-width="14"
        points="242.721 274.41 279.618 274.41 330.993 324"
      />
      <polyline
        stroke="#FFF"
        stroke-width="14"
        points="200 331.156 221.037 311 240 320.931 280.63 326.441"
      />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '32'
    }
  }
}
</script>
