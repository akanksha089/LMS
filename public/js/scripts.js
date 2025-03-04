document.addEventListener("DOMContentLoaded", () => {
    // Open modal
    function openModal(id) {
        document.getElementById(id).classList.remove("hidden");
    }

    // Close modal
    function closeModal(id) {
        document.getElementById(id).classList.add("hidden");
    }

    // Populate Edit Modal with user data
    function openEditModal(id, name, email, role) {
        document.getElementById("editUserId").value = id;
        document.getElementById("editUserName").value = name;
        document.getElementById("editUserEmail").value = email;
        document.getElementById("editUserRole").value = role;
        openModal("editUserModal");
    }

    // Handle Add User Form Submission
    const addUserForm = document.getElementById("addUserForm");
    if (addUserForm) {
        addUserForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(addUserForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("/admin/users/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                if (response.ok) {
                    Swal.fire("Success", "User added successfully!", "success").then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire("Error", result.message || "Failed to add user", "error");
                }
            } catch (error) {
                Swal.fire("Error", "Something went wrong!", "error");
            }
        });
    }

    // Handle Edit User Form Submission
    const editUserForm = document.getElementById("editUserForm");
    if (editUserForm) {
        editUserForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(editUserForm);
            const data = Object.fromEntries(formData.entries());
            const userId = data.id;

            try {
                const response = await fetch(`/admin/users/edit/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                if (response.ok) {
                    Swal.fire("Success", "User updated successfully!", "success").then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire("Error", result.message || "Failed to update user", "error");
                }
            } catch (error) {
                Swal.fire("Error", "Something went wrong!", "error");
            }
        });
    }

    // SweetAlert confirmation for Delete User
    window.confirmDelete = async function (userId) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This user will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/admin/users/delete/${userId}`, { method: "DELETE" });

                if (response.ok) {
                    Swal.fire("Deleted!", "User has been removed.", "success").then(() => {
                        window.location.reload();
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire("Error", errorData.message || "Failed to delete user", "error");
                }
            } catch (error) {
                Swal.fire("Error", "Something went wrong!", "error");
            }
        }
    };

    // Expose functions globally
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.openEditModal = openEditModal;
});
