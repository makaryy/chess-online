module.exports = {
    content: ["./src/**/*.{html,js,ts,tsx}"],
    theme: {
        extend: {
            gridTemplateRows: {
                8: "repeat(8, minmax(0, 1fr))"
            },
            boxShadow: {
                alert: "0px 0px 15px 5px"
            }
        }
    },
    plugins: []
};
