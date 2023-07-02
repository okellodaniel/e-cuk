"use client"
import { Modal } from "@/components/ui/modal"

const SetupPage = () => {
    return (

        <div className="p-4">
            <Modal title="waagwan" description="Test Desc" isOpen={true} onClose={() => { }}>
                children
            </Modal>
        </div>

    )
}

export default SetupPage
