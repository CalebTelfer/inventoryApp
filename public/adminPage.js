document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;

        if(confirm("Are you sure?")) {
            //delete game
            const response = await fetch (`/admin/delete/${id}`, {
                method: "DELETE"
            })

            if (response.ok) {
                location.reload();
            } else {
                alert("Deletion failed");
            }
        }
    })
})

document.querySelectorAll(".edit-button").forEach(button => {
    button.addEventListener("click", async (e) => {
        // serve new page with single game and edit details.
    })
})