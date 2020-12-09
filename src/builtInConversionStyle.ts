export default `
.writtenMongolKeyboardConversions {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  text-justify: inter-ideograph;
  text-align: left;
  writing-mode: tb-lr;
  writing-mode: vertical-lr;
  text-orientation: sideways-right;
  size: auto;

  position: absolute;
  background-color: #f0f0f0;
  border: 1px solid #fff;
  z-index: 1000002;
  left: 0;
  top: 0;
  border-radius: 3px;
  max-width: 360px;
  overflow: scroll;
  font-size: 16px;
  min-height: 50px;
}
.writtenMongolKeyboardConversions_item {
  cursor: pointer;
  border-right: 1px solid #fff;
  padding: 5px;
  color: #333;
}
.writtenMongolKeyboardConversions_item:last-child {
  border-right: none;
}
.writtenMongolKeyboardConversions_item:hover {
  background-color: #fff;
}
.writtenMongolKeyboardConversions_item.writtenMongolConversionActive {
  color: darkturquoise;
}
.writtenMongolKeyboardConversions_itemDescription {
  font-size: 0.8rem;
  color: #777;
}
`
