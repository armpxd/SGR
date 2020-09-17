export { }

declare global {
    interface String {
        includesInvariant(compareText: string): boolean;
    }
}

String.prototype.includesInvariant = function(compareText: string) {
    if(compareText == null) return false;
    let norm = compareText.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return this.toLowerCase.includes(norm.toLowerCase());
}
