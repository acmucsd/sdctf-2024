from SDES import SDES
import secrets


class SDESPlusPlus:
    def __init__(self, master_key=0):
        self.sdes = SDES(master_key)

    def encrypt(self, message: bytes) -> bytes:
        session_key = secrets.randbits(64)
        session_key_bytes = session_key.to_bytes(8, "big")
        header = self.sdes.encrypt(session_key_bytes + session_key_bytes) # redundancy for error checking purposes
        session_sdes = SDES(session_key)
        body = session_sdes.encrypt(message)
        return header + body
    
    def decrypt(self, message: bytes) -> bytes:
        header = message[:16]
        if (header[:8] != header[:8]): return None # redundancy error checking
        encrypted_session_key = header[:8]
        session_key_bytes = self.sdes.decrypt(encrypted_session_key)
        session_key = int.from_bytes(session_key_bytes, "big")
        session_sdes = SDES(session_key)
        body = message[16:]
        pt = session_sdes.decrypt(body)
        return pt